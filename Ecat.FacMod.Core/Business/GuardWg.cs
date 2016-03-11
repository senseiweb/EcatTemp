using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.Utility;

namespace Ecat.FacMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public class GuardWg
    {

        public FacCtx FacCtx { get; set; }
      
        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {
            var wgMapKey = saveMap.Keys.Single(sm => sm == typeof (WorkGroup));

            if (wgMapKey == null)
            {
                return saveMap;
            }

            var workGroupInfos = saveMap[wgMapKey];

            foreach (var info in workGroupInfos)
            {
                var wg = info.Entity as WorkGroup;

                if (wg == null)
                {
                    continue;
                }

                if (info.OriginalValuesMap.ContainsKey("MpSpStatus") && wg.MpSpStatus == MpSpStatus.Published)
                {
                    PublishWorkGroup(wg, info);
                }
            }
            return saveMap;
        }

        private void PublishWorkGroup(WorkGroup wg, EntityInfo entityInfo)
        {
            //Retrive our own version of the workgroup from the db with related items
            var svrWg = FacCtx.WorkGroups
                .Where(grp => grp.Id == wg.Id && wg.MpSpStatus == MpSpStatus.UnderReview)
                .Include(grp => grp.WgModel)
                .Include(grp => grp.SpResults)
                .Include(grp => grp.SpStratResults)
                .Include(grp => grp.GroupMembers)
                .Include(grp => grp.SpResponses)
                .Include(grp => grp.SpStratResponses)
                .Include(grp => grp.FacSpResponses)
                .Include(grp => grp.FacStratResponses)
                .Single();

            //setup things to save later
            var wgSpAssessResults = new List<SpResult>();

            //Lets removed the deleted group members
            var members = svrWg.GroupMembers.Where(gm => !gm.IsDeleted).ToList();

            //Lets make sure that all the active members have been assessed and stratified
            foreach (var mySelf in members)
            {
                var verificationError = VerifyWgData(mySelf, members);

                if (verificationError != null)
                {
                    var error = new EFEntityError(entityInfo,"Publication Error",verificationError, "MpSpStatus");
                    throw new EntityErrorsException(new List<EntityError> { error });
                }

                //Still here, good...lets start with calculating the assessment result
                var existingResult =
                    svrWg.SpResults.Single(result =>
                            result.StudentId == mySelf.StudentId &&
                            result.WorkGroupId == mySelf.WorkGroupId &&
                            result.CourseId == mySelf.CourseId);

                var calcResult = CalculateSpAssessResult(mySelf, svrWg.FacSpResponses.ToList());

                if (existingResult != null)
                {
                    existingResult.MpAssessResult = calcResult.MpAssessResult;
                    existingResult.SpResultScore = calcResult.SpResultScore;
                }
                else
                {
                    wgSpAssessResults.Add(calcResult);
                }
            }

            //Now is the time to the all important stratification calculation
            var wgStratScores = CalculateStratResult(svrWg.GroupMembers.ToList()).ToList();
            var finalResult = CalculateLineup(wgStratScores, svrWg.WgModel.MaxStratStudent,
                svrWg.WgModel.MaxStratFaculty, svrWg.WgModel.StratDivisor);

        }

        private static string ConvertScoreToOutcome(float score)
        {
            if (score <= MpSpResultScore.Ie)
            {
                return MpAssessResult.Ie;
            }

            if (score <= MpSpResultScore.Bae)
            {
                return MpAssessResult.Bae;
            }

            if (score <= MpSpResultScore.E)
            {
                return MpAssessResult.Ae;
            }

            if (score <= MpSpResultScore.Aae)
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
                (from strat in myStratsByPosition let multiplier = 1 - strat.Key*scoreInterval select multiplier*strat.ToList().Count).Sum()
                select new StratResult
                {
                    StudentId = member.StudentId,
                    CourseId = member.CourseId,
                    WorkGroupId = member.WorkGroupId,
                    StratCummScore = (float) totalStratScore,
                }).ToList();
        }

        private static IEnumerable<StratResult> CalculateLineup(IEnumerable<StratResult> results, float topStudStrat, float topInstrStrat, int divisor)
        {
            var studInterval = topStudStrat / divisor;
            var instrInterval = Math.Abs(topInstrStrat) < 0 ? 0 : topInstrStrat/divisor;
            var studStratWorth = new Dictionary<int, float>();
            var instrStratWorth = new Dictionary<int, float>();

            var currentStratPosition = 1;
            var currentStratWorth = topStudStrat;

            do
            {
                studStratWorth.Add(currentStratPosition, currentStratWorth);
                currentStratPosition += 1;
                currentStratWorth -= studInterval;
            } while (currentStratWorth >= 0);


            if (Math.Abs(instrInterval) > 0)
            {
                currentStratPosition = 1;
                currentStratWorth = topInstrStrat;
                do
                {
                    instrStratWorth.Add(currentStratPosition, currentStratWorth);
                    currentStratPosition += 1;
                    currentStratWorth -= instrInterval;
                } while (currentStratWorth >= 0);
            }

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
                var stratWorth = (float) 0m;
                var instrWorth = (float) 0m;

                studStratWorth.TryGetValue(strat, out stratWorth);
                instrStratWorth.TryGetValue(strat, out instrWorth);

                resultsScoreAndInstr[i].FinalStratPosition = strat;
                resultsScoreAndInstr[i].StratAwardedScore = (float)(stratWorth + instrWorth);

                wgResults.Add(resultsScoreAndInstr[i]);
            }

            return wgResults;
        } 

        private static string VerifyWgData(CrseStudentInGroup me, IReadOnlyCollection<CrseStudentInGroup> peers)
        {
            var peopleWhoHaveNotAssessMe =
                  peers.Where(
                      gm => gm.AssesseeSpResponses.Any(response => response.AssesseePersonId == me.StudentId)).ToList();

            var peopleWhoHaveNotStratifiedMe =
               peers.Where(
                   gm => gm.AssesseeStratResponse.Any(response => response.AssesseePersonId == me.StudentId)).ToList();

            var peopleWhoIHaveNotAssess =
                peers.Where(
                    gm => gm.AssessorSpResponses.Any(response => response.AssessorPersonId == me.StudentId)).ToList();

            var peopleWhoIHaveNotStratified =
               peers.Where(
                   gm => gm.AssesseeStratResponse.Any(response => response.AssessorPersonId == me.StudentId)).ToList();

            var myFacStrat = me.FacultyStrat?.StratPosition;

            //Go ahead and end everything if we are missing data
            return (peopleWhoHaveNotAssessMe.Any() ||
                    peopleWhoHaveNotStratifiedMe.Any() ||
                    peopleWhoIHaveNotAssess.Any() ||
                    peopleWhoIHaveNotStratified.Any() ||
                    myFacStrat == null) ? $"There was a problem validating necessary information . Status: [Them => Me] NA: {peopleWhoHaveNotAssessMe.Count}, NS: {peopleWhoHaveNotStratifiedMe.Count} | [Me => Them] NA: {peopleWhoIHaveNotAssess.Count}, NS: {peopleWhoIHaveNotStratified.Count} | FacStrat: {myFacStrat}" : null;
        
        }

    }
}
