using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.Utility;

namespace Ecat.FacMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public static class WorkGroupPublish
    {
        private static readonly Type tSpResult = typeof(SpResult);
        private static readonly Type tStratResult = typeof(StratResult);
        private static readonly Type tWg = typeof (WorkGroup);

        public static SaveMap Publish(SaveMap wgSaveMap, IEnumerable<int> svrWgIds, int loggedInPersonId,
            EFContextProvider<FacCtx> ctxProvider)
        {
            var infos = wgSaveMap.Single(map => map.Key == tWg).Value;

            var pubWgs = GetPublishingWgData(svrWgIds, ctxProvider);

            foreach (var wg in pubWgs)
            {
                var stratScoreInterval = 1m/wg.PubWgMembers.Count();
                var stratKeeper = new List<PubWgMember>();
                var countOfGrp = (float) wg.PubWgMembers.Count();
                foreach (var me in wg.PubWgMembers)
                {
                    if (me.PeersDidNotAssessMe.Any() || me.PeersIdidNotAssess.Any() || me.PeersDidNotStratMe.Any() ||
                        me.PeersIdidNotStrat.Any() || me.FacStratPosition == 0)
                    {
                        var errorMessage =
                            $"There was a problem validating necessary information . Problem Flags Are: [Them => Me] NA: !{me.PeersDidNotAssessMe.Count()}, NS: {me.PeersDidNotStratMe.Any()} | [Me => Them] NA: {me.PeersIdidNotAssess.Count()}, NS: {me.PeersIdidNotStrat.Any()} | FacStrat: {me.FacStratPosition}";

                        var error = infos.Select(
                            info => new EFEntityError(info, "Publication Error", errorMessage, "MpSpStatus"));
                        throw new EntityErrorsException(error);
                    }
                    var peerCount = countOfGrp - 1;
                    var resultScore = me.SpResponseTotalScore;
                    var spResult = new SpResult
                    {
                        CourseId = wg.CourseId,
                        WorkGroupId = wg.Id,
                        StudentId = me.StudentId,
                        AssignedInstrumentId = wg.InstrumentId,
                        CompositeScore = resultScore, 
                        BreakOut = new SpResultBreakOut
                        {
                            NotDisplay = me.BreakOut.NotDisplayed,
                            IneffA = me.BreakOut.IneffA,
                            IneffU = me.BreakOut.IneffU,
                            EffA = me.BreakOut.EffA,
                            EffU = me.BreakOut.EffU,
                            HighEffA = me.BreakOut.HighEffA,
                            HighEffU = me.BreakOut.HighEffU
                        },
                        MpAssessResult = ConvertScoreToOutcome(resultScore),
                    };

                    var resultInfo = ctxProvider.CreateEntityInfo(spResult, me.HasSpResult ? EntityState.Modified : EntityState.Added);

                    resultInfo.ForceUpdate = me.HasSpResult;

                    if (!wgSaveMap.ContainsKey(tSpResult))
                    {
                        wgSaveMap[tSpResult] = new List<EntityInfo> {resultInfo};
                    }
                    else
                    {
                        wgSaveMap[tSpResult].Add(resultInfo);
                    }

                    var stratResult = new StratResult
                    {
                        CourseId = wg.CourseId,
                        StudentId = me.StudentId,
                        WorkGroupId = wg.Id,
                        ModifiedById = loggedInPersonId,
                        ModifiedDate = DateTime.Now,
                        StratCummScore = me.StratTable.Select(strat =>
                        {
                            var multipler = 1 - strat.Position*stratScoreInterval;
                            return (float) multipler*strat.Count;
                        }).Sum()
                    };

                    me.StratResult = stratResult;
                    stratKeeper.Add(me);
                }

                var cummScores = new List<float>();
                var oi = 1;

                foreach (var strat in stratKeeper.OrderByDescending(sk => sk.StratResult.StratCummScore))
                {

                    if (cummScores.Contains(strat.StratResult.StratCummScore) || !cummScores.Any())
                    {
                        strat.StratResult.OriginalStratPosition = oi;
                        cummScores.Add(strat.StratResult.StratCummScore);
                        continue;
                    };
                    cummScores.Add(strat.StratResult.StratCummScore);

                    oi += 1;
                    strat.StratResult.OriginalStratPosition = oi;
                }

                var fi = 0;

                foreach (
                    var strat in
                        stratKeeper.OrderByDescending(sk => sk.StratResult.StratCummScore)
                            .ThenBy(sk => sk.FacStratPosition))
                {
                    var studAwardedPoints = wg.WgSpTopStrat - (wg.WgSpTopStrat/wg.StratDivisor)*fi;
                    var instrAwardPoints = wg.WgFacTopStrat - (wg.WgFacTopStrat/wg.StratDivisor)*fi;

                    var totalAward = studAwardedPoints + instrAwardPoints;

                    totalAward = (totalAward < 0) ? 0 : totalAward;

                    strat.StratResult.StratAwardedScore = totalAward;
                    strat.StratResult.FinalStratPosition = fi + 1;

                    var info = ctxProvider.CreateEntityInfo(strat.StratResult,
                        strat.HasStratResult ? EntityState.Modified : EntityState.Added);
                    info.ForceUpdate = strat.HasStratResult;

                    if (!wgSaveMap.ContainsKey(tStratResult))
                    {
                        wgSaveMap[tStratResult] = new List<EntityInfo> { info };
                    }
                    else
                    {
                        wgSaveMap[tStratResult].Add(info);
                    }

                    fi += 1;
                }
            }
            return wgSaveMap;
        }

        private static string ConvertScoreToOutcome(int avgCompositeScore)
        {
            if (avgCompositeScore <= MpSpResultScore.Ie)
            {
                return MpAssessResult.Ie;
            }

            if (avgCompositeScore < MpSpResultScore.Bae)
            {
                return MpAssessResult.Bae;
            }

            if (avgCompositeScore < MpSpResultScore.E)
            {
                return MpAssessResult.E;
            }

            if (avgCompositeScore < MpSpResultScore.Aae)
            {
                return MpAssessResult.Aae;
            }

            return avgCompositeScore <= MpSpResultScore.He ? MpAssessResult.He : "Out of Range";
        }

        private static IEnumerable<PubWg> GetPublishingWgData(IEnumerable<int> wgIds, EFContextProvider<FacCtx> efCtx)
        {
            return efCtx.Context.WorkGroups
                .Where(
                    wg => wgIds.Contains(wg.Id) &&
                          wg.MpSpStatus == MpSpStatus.UnderReview &&
                          wg.SpComments.All(comment => comment.Flag.MpFaculty != null))
                .Select(wg => new PubWg
                {
                    Id = wg.Id,
                    CourseId = wg.CourseId,
                    CountInventory = wg.AssignedSpInstr.InventoryCollection.Count,
                    InstrumentId = wg.AssignedSpInstrId,
                    WgSpTopStrat = wg.WgModel.MaxStratStudent,
                    WgFacTopStrat = wg.WgModel.MaxStratFaculty,
                    StratDivisor = wg.WgModel.StratDivisor,
                    PubWgMembers = wg.GroupMembers.Where(gm => !gm.IsDeleted).Select(gm => new PubWgMember
                    {
                        StudentId = gm.StudentId,
                        Name = gm.StudentProfile.Person.LastName + gm.StudentProfile.Person.FirstName,
                        SpResponseTotalScore = gm.AssesseeSpResponses
                            .Where(response => response.AssessorPersonId != gm.StudentId) 
                            .Sum(response => response.ItemModelScore) / gm.AssesseeSpResponses
                            .Count(response => response.AssessorPersonId != gm.StudentId),
                        FacStratPosition = gm.FacultyStrat.StratPosition,
                        HasSpResult = wg.SpResults.Any(result => result.StudentId == gm.StudentId),
                        HasStratResult = wg.SpStratResults.Any(result => result.StudentId == gm.StudentId),
                        BreakOut = new PubWgBreakOut
                        {
                            NotDisplayed = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Nd),
                            IneffA = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Iea),
                            IneffU = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Ieu),
                            EffA = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Ea),
                            EffU = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Eu),
                            HighEffA = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Hea),
                            HighEffU = gm.AssesseeSpResponses.Count(response => response.MpItemResponse == MpSpItemResponse.Heu)
                        },
                        StratTable =
                            gm.AssesseeStratResponse
                                .Where(response => response.AssessorPersonId != gm.StudentId)
                                .GroupBy(strat => strat.StratPosition)
                                .Select(stratgrp => new PubWgStratTable
                                {
                                    Position = stratgrp.Key,
                                    Count = stratgrp.Count()
                                }),
                        PeersDidNotAssessMe =
                            wg.GroupMembers.Where(
                                peer =>
                                    peer.AssessorSpResponses.Count(response => response.AssesseePersonId == gm.StudentId) == 0)
                                .Select(peer => peer.StudentId),
                        PeersIdidNotAssess =
                            wg.GroupMembers.Where(
                                peer =>
                                    peer.AssesseeSpResponses.Count(response => response.AssessorPersonId == gm.StudentId) == 0)
                                .Select(peer => peer.StudentId),
                        PeersDidNotStratMe =
                            wg.GroupMembers.Where(
                                peer => peer.AssessorStratResponse.Count(strat => strat.AssesseePersonId == gm.StudentId) == 0)
                                .Select(peer => peer.StudentId),
                        PeersIdidNotStrat =
                            wg.GroupMembers.Where(
                                peer => peer.AssesseeStratResponse.Count(strat => strat.AssessorPersonId == gm.StudentId) == 0)
                                .Select(peer => peer.StudentId)
                    })
                });
        }
    }


}
