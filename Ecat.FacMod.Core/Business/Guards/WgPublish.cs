﻿using System;
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
        private static readonly Type tSpResult = typeof (SpResult);
        private static readonly Type tStratResult = typeof (StratResult);
        private static readonly Type tWg = typeof (WorkGroup);

        public static SaveMap Publish(SaveMap wgSaveMap, IEnumerable<int> svrWgIds, int loggedInPersonId,
            EFContextProvider<FacCtx> ctxProvider)
        {
            var infos = wgSaveMap.Single(map => map.Key == tWg).Value;

            var pubWgs = GetPublishingWgData(svrWgIds, ctxProvider);

            foreach (var wg in pubWgs)
            {
                var stratScoreInterval = 1m/wg.PubWgMembers.Count();
                stratScoreInterval = decimal.Round(stratScoreInterval, 4);
                var stratKeeper = new List<PubWgMember>();
                var countOfGrp =  wg.PubWgMembers.Count();
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
                    var resultScore = ((decimal) me.SpResponseTotalScore / (me.CountSpResponses * 6)) * 100;
                    var spResult = new SpResult
                    {
                        CourseId = wg.CourseId,
                        WorkGroupId = wg.Id,
                        StudentId = me.StudentId,
                        AssignedInstrumentId = wg.InstrumentId,
                        CompositeScore = (int)resultScore,
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
                        MpAssessResult = ConvertScoreToOutcome((int)resultScore),
                    };

                    var resultInfo = ctxProvider.CreateEntityInfo(spResult,
                        me.HasSpResult ? EntityState.Modified : EntityState.Added);

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
                        StratCummScore = decimal.Round(me.StratTable.Select(strat =>
                        {
                            var multipler = 1 - (strat.Position-1)*stratScoreInterval;
                            return  multipler*strat.Count;
                        }).Sum(), 4)
                    };

                    me.StratResult = stratResult;
                    stratKeeper.Add(me);
                }

                var cummScores = new List<decimal>();
                var oi = 1;

                foreach (var strat in stratKeeper.OrderByDescending(sk => sk.StratResult.StratCummScore))
                {

                    if (cummScores.Contains(strat.StratResult.StratCummScore) || !cummScores.Any())
                    {
                        strat.StratResult.OriginalStratPosition = oi;
                        cummScores.Add(strat.StratResult.StratCummScore);
                        continue;
                    }
                    ;
                    cummScores.Add(strat.StratResult.StratCummScore);

                    oi += 1;
                    strat.StratResult.OriginalStratPosition = oi;
                }

                var fi = 0;
                var spInterval = wg.WgSpTopStrat / wg.StratDivisor;
                var facInterval = wg.WgFacTopStrat / wg.StratDivisor;


                foreach (
                    var gm in
                        stratKeeper.OrderByDescending(sk => sk.StratResult.StratCummScore)
                            .ThenBy(sk => sk.FacStratPosition))
                {
                    var studAwardedPoints = wg.WgSpTopStrat - spInterval*fi;
                    var instrAwardPoints = Math.Max(0, wg.WgFacTopStrat - ((wg.WgFacTopStrat/wg.StratDivisor)*(gm.FacStratPosition - 1)));

                    var totalAward = studAwardedPoints + instrAwardPoints;

                    totalAward = (totalAward < 0) ? 0 : totalAward;

                    gm.StratResult.StratAwardedScore = totalAward;
                    gm.StratResult.FinalStratPosition = fi + 1;

                    var info = ctxProvider.CreateEntityInfo(gm.StratResult,
                        gm.HasStratResult ? EntityState.Modified : EntityState.Added);
                    info.ForceUpdate = gm.HasStratResult;

                    if (!wgSaveMap.ContainsKey(tStratResult))
                    {
                        wgSaveMap[tStratResult] = new List<EntityInfo> {info};
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
            var ids = wgIds.ToList();

            var pubWgData = (from wg in efCtx.Context.WorkGroups
                             where ids.Contains(wg.WorkGroupId) &&
                                   wg.MpSpStatus == MpSpStatus.UnderReview &&
                                   wg.SpComments.All(comment => comment.Flag.MpFaculty != null)
                             select new PubWg
                             {
                                 Id = wg.WorkGroupId,
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
                                     CountSpResponses = gm.AssesseeSpResponses
                                         .Count(response => response.AssessorPersonId != gm.StudentId),
                                     SpResponseTotalScore = gm.AssesseeSpResponses
                                         .Where(response => response.AssessorPersonId != gm.StudentId)
                                         .Sum(response => response.ItemModelScore),
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
                                     SelfStratPosition = gm.AssesseeStratResponse
                                         .Where(strat => strat.AssessorPersonId == gm.StudentId)
                                         .Select(strat => strat.StratPosition).FirstOrDefault(),
                                     PubStratResponses =
                                         gm.AssessorStratResponse.Where(strat => strat.AssesseePersonId != gm.StudentId)
                                             .Select(strat => new PubStratResponse
                                             {
                                                 AssesseeId = strat.AssesseePersonId,
                                                 StratPosition = strat.StratPosition
                                             }),
                                     PeersDidNotAssessMe =
                                         wg.GroupMembers.Where(peer => peer.AssessorSpResponses
                                         .Count(response => response.AssesseePersonId == gm.StudentId) == 0)
                                         .Select(peer => peer.StudentId),
                                     PeersIdidNotAssess = wg.GroupMembers.Where(peer => peer.AssesseeSpResponses
                                     .Count(response => response.AssessorPersonId == gm.StudentId) == 0)
                                     .Select(peer => peer.StudentId),
                                     PeersDidNotStratMe = wg.GroupMembers.Where(peer => peer.AssessorStratResponse
                                     .Count(strat => strat.AssesseePersonId == gm.StudentId) == 0)
                                     .Select(peer => peer.StudentId),
                                     PeersIdidNotStrat = wg.GroupMembers.Where(peer => peer.AssesseeStratResponse
                                     .Count(strat => strat.AssessorPersonId == gm.StudentId) == 0)
                                     .Select(peer => peer.StudentId)
                                 })
                             }).ToList();


            foreach (var wg in pubWgData)
            {
                //Dictionary used to keep the assessee personid with an additional dictionary to keep the 
                //assessee strat position and the number of those position
                var assesseeStratDict = new Dictionary<int, Dictionary<int, int>>();

                foreach (var gm in wg.PubWgMembers)
                {
                    foreach (var response in gm.PubStratResponses)
                    {
                        Dictionary<int, int> assesseResponses;

                        var hasAssessee = assesseeStratDict.TryGetValue(response.AssesseeId, out assesseResponses);

                        var position = response.StratPosition > gm.SelfStratPosition
                            ? response.StratPosition - 1
                            : response.StratPosition;

                        if (!hasAssessee)
                        {
                            assesseeStratDict[response.AssesseeId] = new Dictionary<int, int>();
                        }

                        int stratPositionCount;
                        var hasStratPosition = assesseeStratDict[response.AssesseeId].TryGetValue(position, out stratPositionCount);

                        if (!hasStratPosition)
                        {
                            assesseeStratDict[response.AssesseeId][position] = 1;
                        } else
                        {
                            assesseeStratDict[response.AssesseeId][position] = stratPositionCount += 1;
                        }

                    }
                }

                foreach (var gm in wg.PubWgMembers)
                {
                    var myResponses = assesseeStratDict[gm.StudentId];
                    gm.StratTable = myResponses.Select(mr => new PubWgStratTable
                    {
                        Position = mr.Key,
                        Count = mr.Value
                    });
                }
            }

            return pubWgData;
        }
    }
}
