using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.Web.Controllers
{
    public class LtiController : Controller
    {
        private readonly ITests _test;

        public LtiController(ITests test)
        {
            _test = test;
        }
     
        // GET: Lti
        public ActionResult Secure()
        {
            return View();
        }

        public List<Person> Ping2()
        {
            using (var writer = new StreamWriter(Server.MapPath("/TestDbSeed.Sql")))
            {
                var studentIdList = new List<int>();

                var rand = new Random();

                for (var i = 1; i <= 264; i++)
                {
                    studentIdList.Add(i);
                }

                using (var ctx = new EcatContext())
                {

                    var wg = ctx.WorkGroups.Where(group => group.CourseId == 6).ToList();

                    var grpByTypes = wg.GroupBy(g => g.MpCategory);

                    foreach (var grpType in grpByTypes)
                    {
                        var studentMix = new List<int>();

                        studentMix.AddRange(studentIdList.OrderBy(id => rand.Next()));

                        foreach (var wrkgrp in grpType)
                        {
                            var groupMembers = new List<CrseStudentInGroup>();

                            for (var i = 1; i <= 12; i++)
                            {
                                var newMember = new CrseStudentInGroup
                                {
                                    CourseId = 6,
                                    WorkgroupId = wrkgrp.Id,
                                    StudentId = studentMix.First()
                                };


                                var spResult = new SpResult
                                {
                                    CourseId = 6,
                                    WorkGroupId = wrkgrp.Id,
                                    StudentId = studentMix.First(),
                                    IsScored = false,
                                    AssignedInstrumentId = wrkgrp.AssignedSpInstrId
                                };
                                groupMembers.Add(newMember);
                                studentMix.Remove(newMember.StudentId);

                                writer.WriteLine($"INSERT INTO StudentInGroup(CourseId,WorkGroupId,StudentId,IsDeleted,ModifiedDate) values ({6},{newMember.WorkgroupId},{newMember.StudentId},'false','{DateTime.Now.ToUniversalTime()}');");
                                writer.WriteLine($"INSERT INTO SpResult(CourseId,WorkGroupId,StudentId,AssignedInstrumentId,IsScored) values ({6},{spResult.WorkGroupId},{spResult.AssignedInstrumentId},{spResult.StudentId},'false');");
                            }

                            var peers = groupMembers;
                            List<int> inventoryList;

                            if (wrkgrp.MpCategory == MpGroupType.Wg1 || wrkgrp.MpCategory == MpGroupType.Wg4)
                            {
                                inventoryList = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
                            }
                            else
                            {
                                inventoryList = new List<int> { 11, 12, 13, 14, 15 };
                            }

                            foreach (var member in groupMembers)
                            {
                                var strats = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };
                                var stratMix = new List<int>();
                                stratMix.AddRange(strats.OrderBy(p => rand.Next()));

                                foreach (var peer in peers)
                                {
                                    foreach (var item in inventoryList)
                                    {
                                        var mdlScore = rand.Next(-2, 4);
                                        var mdlResponse = "";
                                        switch (mdlScore)
                                        {
                                            case -2:
                                                mdlResponse = MpSpItemResponse.Iea;
                                                break;
                                            case -1:
                                                mdlResponse = MpSpItemResponse.Ieu;
                                                break;
                                            case 0:
                                                mdlResponse = MpSpItemResponse.Nd;
                                                break;
                                            case 1:
                                                mdlResponse = MpSpItemResponse.Eu;
                                                break;
                                            case 2:
                                                mdlResponse = MpSpItemResponse.Ea;
                                                break;
                                            case 3:
                                                mdlResponse = MpSpItemResponse.Heu;
                                                break;
                                            case 4:
                                                mdlResponse = MpSpItemResponse.Ieu;
                                                break;
                                        }

                                        var spResponse = new SpResponse
                                        {
                                            CourseId = 6,
                                            WorkGroupId = wrkgrp.Id,
                                            AssesseePersonId = peer.StudentId,
                                            AssessorPersonId = member.StudentId,
                                            InventoryItemId = item,
                                            ItemModelScore = mdlScore,
                                            MpItemResponse = mdlResponse,
                                            SpResult = null
                                        };

                                        writer.WriteLine($"INSERT INTO SpResponse(AssessorPersonId,AssesseePersonId,CourseId,WorkGroupId,InventoryItemId, ItemResponse,ItemModelScore,ModifiedDate) values ({spResponse.AssessorPersonId},{spResponse.AssesseePersonId},{6},{spResponse.WorkGroupId},{spResponse.InventoryItemId},'{spResponse.MpItemResponse}',{spResponse.ItemModelScore},'{DateTime.Now.ToUniversalTime()}');");

                                        Debug.WriteLine($"Member {member.StudentId} ==> Peer {peer.StudentId} ==> InventoryItem {item} Done with response {mdlResponse}");
                                    }
                                    var currentStrat = stratMix.First();
                                    var stratResponse = new StratResponse
                                    {
                                        CourseId = 6,
                                        AssessorPersonId = member.StudentId,
                                        AssesseePersonId = peer.StudentId,
                                        WorkGroupId = member.WorkgroupId,
                                        StratPosition = currentStrat

                                    };

                                    writer.WriteLine($"INSERT INTO StratResponse(AssessorPersonId,AssesseePersonId,CourseId,WorkGroupId,StratPosition,ModifiedDate) values ({stratResponse.AssessorPersonId},{stratResponse.AssesseePersonId},{6},{stratResponse.WorkGroupId},{stratResponse.StratPosition},'{DateTime.Now.ToUniversalTime()}');");

                                    Debug.WriteLine($"Member {member.StudentId} ==> Peer {peer.StudentId} ==> Strat response {stratMix.First()}");
                                    stratMix.Remove(currentStrat);

                                    Debug.WriteLine($"Member {member.StudentId} ==> Peer {peer.StudentId} done!");
                                }
                                Debug.WriteLine($"Member {member.StudentId}  done!");
                            }
                            Debug.WriteLine($"Workgrp {wrkgrp.DefaultName} done!");
                        }
                        Debug.WriteLine($"GroupType {grpType.Key} done!");
                   }
                }
            }
            return _test.Persons().ToList();
        } 

        public string Ping()
        {
        
            return _test.MvcTest;
        }
    }
}