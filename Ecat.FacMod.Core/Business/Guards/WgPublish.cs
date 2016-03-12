using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.Logic;
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

        public static SaveMap Publish(SaveMap wgSaveMap, IEnumerable<WorkGroup> svrWorkGroups, int loggedInPersonId, EFContextProvider<FacCtx> ctxProvider)
        {
            var infos = wgSaveMap.Single(map => map.Key == tWg).Value;

            foreach (var svrWorkGroup in svrWorkGroups)
            {
                //Lets removed the deleted group members
                var members = svrWorkGroup.GroupMembers.Where(gm => !gm.IsDeleted).ToList();

                //Lets make sure that all the active members have been assessed and stratified
                foreach (var mySelf in members)
                {
                    var verificationError = VerifyWgData(mySelf, members);

                    if (verificationError != null)
                    {
                        var error =
                            infos.Select(
                                info => new EFEntityError(info, "Publication Error", verificationError, "MpSpStatus"));
                        throw new EntityErrorsException(error);
                    }

                    //Still here, good...lets start with calculating the assessment result
                    var existingSpResult =
                        svrWorkGroup.SpResults.SingleOrDefault(result =>
                            result.StudentId == mySelf.StudentId &&
                            result.WorkGroupId == mySelf.WorkGroupId &&
                            result.CourseId == mySelf.CourseId);

                    var calcSpResult = CalculateSpAssessResult(mySelf, svrWorkGroup.FacSpResponses.ToList());

                    if (existingSpResult != null)
                    {
                        existingSpResult.MpAssessResult = calcSpResult.MpAssessResult;
                        existingSpResult.SpResultScore = calcSpResult.SpResultScore;
                        existingSpResult.ModifiedById = loggedInPersonId;
                        existingSpResult.ModifiedDate = DateTime.Now;
                        var info = ctxProvider.CreateEntityInfo(existingSpResult, EntityState.Modified);
                        info.ForceUpdate = true;
                        wgSaveMap[tSpResult].Add(info);
                    }
                    else
                    {
                        var info = ctxProvider.CreateEntityInfo(calcSpResult);
                        wgSaveMap[tSpResult].Add(info);
                    }
                }

                //Now is the time to the all important stratification calculation

                var wgStratScores = CalculateStratResult(svrWorkGroup.GroupMembers.ToList()).ToList();

                var finalResults = CalculateLineup(wgStratScores, svrWorkGroup.WgModel.MaxStratStudent,
                    svrWorkGroup.WgModel.MaxStratFaculty, svrWorkGroup.WgModel.StratDivisor);

                foreach (var result in finalResults)
                {
                    var existingResult =
                        svrWorkGroup.SpStratResults.SingleOrDefault(stratResult => stratResult.StudentId == result.StudentId);

                    if (existingResult != null)
                    {
                        existingResult.StratAwardedScore = result.StratAwardedScore;
                        existingResult.StratCummScore = result.StratCummScore;
                        existingResult.FinalStratPosition = result.FinalStratPosition;
                        existingResult.OriginalStratPosition = result.OriginalStratPosition;
                        existingResult.ModifiedById = loggedInPersonId;
                        existingResult.ModifiedDate = DateTime.Now;
                        var info = ctxProvider.CreateEntityInfo(existingResult, EntityState.Modified);
                        info.ForceUpdate = true;
                        wgSaveMap[tSpResult].Add(info);
                    }
                    else
                    {
                        result.ModifiedById = loggedInPersonId;
                        result.ModifiedDate = DateTime.Now;
                        var info = ctxProvider.CreateEntityInfo(result);
                        wgSaveMap[tSpResult].Add(info);
                    }

                }
            }

            return wgSaveMap;
        }

        private static string ConvertScoreToOutcome(float score)
        {
            if (score <= MpSpResultScore.Ie)
            {
                return MpAssessResult.Ie;
            }

            if (score < MpSpResultScore.Bae)
            {
                return MpAssessResult.Bae;
            }

            if (score < MpSpResultScore.E)
            {
                return MpAssessResult.E;
            }

            if (score < MpSpResultScore.Aae)
            {
                return MpAssessResult.Aae;
            }

            return score <= MpSpResultScore.He ? MpAssessResult.He : "Out of Range";
        }

        private static SpResult CalculateSpAssessResult(CrseStudentInGroup me, IEnumerable<FacSpResponse> facResponses)
        {
            var numOfItems = me.AssesseeSpResponses.Count;

            var sumOfResponses = me.AssesseeSpResponses.Sum(response => response.ItemModelScore);

            var myFacSpResponse =
                facResponses.Where(
                    response => response.AssesseePersonId == me.StudentId && !response.IsDeleted).ToList();

            numOfItems += myFacSpResponse.Any() ? myFacSpResponse.Count : 0;
            sumOfResponses += myFacSpResponse.Sum(response => response.ItemModelScore);

            var result = sumOfResponses / numOfItems;

            return new SpResult
            {
                WorkGroupId = me.WorkGroupId,
                AssignedInstrumentId = me.WorkGroup.AssignedSpInstrId,
                CourseId = me.CourseId,
                SpResultScore = result,
                MpAssessResult = ConvertScoreToOutcome(result)
            };
        }

        /// <summary>
        /// Calculation method based on a modified Borda Count Systems
        /// points(p) = 100/#flight members
        /// constituecy = actual votes / possible voters
        /// strat score = p * c
        /// </summary>
        /// <see cref="http://en.wikipedia.org/wiki/Borda_count"/>
        private static IEnumerable<StratResult> CalculateStratResult(IReadOnlyCollection<CrseStudentInGroup> wgMembers)
        {
            var scoreInterval = 1m / wgMembers.Count;

            return (from member in wgMembers
                    let myStratsByPosition = member.AssesseeStratResponse.GroupBy(strat => strat.StratPosition)
                    let totalStratScore =
                    (from strat in myStratsByPosition
                        let multiplier = 1 - strat.Key * scoreInterval select multiplier * strat.ToList().Count).Sum()
                    select new StratResult
                    {
                        StudentId = member.StudentId,
                        CourseId = member.CourseId,
                        WorkGroupId = member.WorkGroupId,
                        StratCummScore = (float)totalStratScore,
                    }).ToList();
        }

        private static IEnumerable<StratResult> CalculateLineup(IEnumerable<StratResult> results, float topStudStrat, float topInstrStrat, int divisor)
        {            
            var wgResults = results.ToList();

            var resultsByScore = wgResults
               .GroupBy(result => result.StratCummScore)
               .OrderByDescending(result => result.Key)
               .ToArray();

            wgResults.Clear();

            for (var i = 0; i <= resultsByScore.Length; i++)
            {
                var membersWithThisScore = resultsByScore[i];
                foreach (var result in membersWithThisScore)
                {
                    result.OriginalStratPosition = i + 1;
                    wgResults.Add(result);
                }
            }

            var resultsScoreAndInstr = wgResults
                .OrderByDescending(result => result.StratCummScore)
                .ThenBy(result => result.FacStrat.StratPosition)
                .ToArray();

            wgResults.Clear();
            for (var i = 0; i <= resultsScoreAndInstr.Length; i++)
            {
                var strat = i + 1;
               

                resultsScoreAndInstr[i].FinalStratPosition = strat;
                var awardStudPoints = topStudStrat - (topStudStrat/divisor)*i;
                var awardFacPoints = topInstrStrat - (topInstrStrat/divisor)*i;
                resultsScoreAndInstr[i].StratAwardedScore = awardStudPoints + awardFacPoints;
                wgResults.Add(resultsScoreAndInstr[i]);
            }

            return wgResults;
        }

        private static string VerifyWgData(CrseStudentInGroup me, IReadOnlyCollection<CrseStudentInGroup> peers)
        {
            var numAssessMeOk =
                  peers.Count(
                      gm => gm.AssesseeSpResponses.Any(response => response.AssesseePersonId == me.StudentId)) != peers.Count;

            var numStratMeOk =
               peers.Count(
                   gm => gm.AssesseeStratResponse.Any(response => response.AssesseePersonId == me.StudentId)) != peers.Count;

            var numIAssessOk =
                peers.Count(
                    gm => gm.AssessorSpResponses.Any(response => response.AssessorPersonId == me.StudentId)) != peers.Count;

            var numIStratOk =
               peers.Count(
                   gm => gm.AssesseeStratResponse.Any(response => response.AssessorPersonId == me.StudentId)) != peers.Count;

            
            var myFacStrat = me.FacultyStrat?.StratPosition;

            //Go ahead and end everything if we are missing data
            return (!numAssessMeOk || !numStratMeOk || !numIAssessOk || !numIStratOk || myFacStrat  == null) ? $"There was a problem validating necessary information . Problem Flags Are: [Them => Me] NA: !{numAssessMeOk}, NS: {numStratMeOk} | [Me => Them] NA: {numIAssessOk}, NS: {numIStratOk} | FacStrat: {myFacStrat}" : null;

        }

    }


}
