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
                                    WorkGroupId = wrkgrp.Id,
                                    StudentId = studentMix.First()
                                };

                                groupMembers.Add(newMember);
                                studentMix.Remove(newMember.StudentId);

                                writer.WriteLine($"INSERT INTO CrseStudentInGroup(CourseId,WorkGroupId,StudentId,IsDeleted,ModifiedDate) values ({6},{newMember.WorkGroupId},{newMember.StudentId},'false','{DateTime.Now.ToUniversalTime()}');");
                            }

                            var peers = groupMembers;
                            List<int> inventoryList;

                            if (wrkgrp.MpCategory == MpGroupCategory.Wg1 || wrkgrp.MpCategory == MpGroupCategory.Wg4)
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
                                            MpItemResponse = mdlResponse
                                        };

                                        if (wrkgrp.MpCategory !=  MpGroupCategory.Wg4)
                                        {
                                            writer.WriteLine($"INSERT INTO SpResponse(AssessorPersonId,AssesseePersonId,CourseId,WorkGroupId,InventoryItemId,ItemResponse,ItemModelScore,ModifiedDate) values ({spResponse.AssessorPersonId},{spResponse.AssesseePersonId},{6},{spResponse.WorkGroupId},{spResponse.InventoryItemId},'{spResponse.MpItemResponse}',{spResponse.ItemModelScore},'{DateTime.Now.ToUniversalTime()}');");

                                            Debug.WriteLine($"Member {member.StudentId} ==> Peer {peer.StudentId} ==> InventoryItem {item} Done with response {mdlResponse}");
                                        }
                                    }
                                      
                                    var currentStrat = stratMix.First();
                                    var stratResponse = new StratResponse
                                    {
                                        CourseId = 6,
                                        AssessorPersonId = member.StudentId,
                                        AssesseePersonId = peer.StudentId,
                                        WorkGroupId = member.WorkGroupId,
                                        StratPosition = currentStrat

                                    };

                                    if (wrkgrp.MpCategory == MpGroupCategory.Wg1 && member.StudentId != peer.StudentId)
                                    {
                                        var comment = new StudSpComment
                                        {
                                            CourseId = 6,
                                            WorkGroupId = member.WorkGroupId,
                                            AuthorPersonId = member.StudentId,
                                            RecipientPersonId = peer.StudentId,
                                            RequestAnonymity = (peer.StudentId%2 == 0 || peer.StudentId%7 == 0) ,
                                            ModifiedDate = DateTime.Now,
                                            CreatedDate = DateTime.Now,
                                            CommentText =
                                                (peer.StudentId %2 == 0)
                                                    ? $"<p>Hi {peer.StudentId} -- I think ...Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
                                                    : (peer.StudentId%5 == 0)
                                                        ? $"<h1>{peer.StudentId} You did great when ...HTML Ipsum Presents</h1><p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href=\"#\">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p><h2>Header Level 2</h2><ol> <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ol><blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote><h3>Header Level 3</h3><ul><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li> <li>Aliquam tincidunt mauris eu risus.</li></ul><pre><code>#header h1 a display: block; width: 300px; height: 80px; /code></pre>"
                                                        : $"<h4>What up {peer.StudentId}, what were you thinking when you r...habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo."

                                        };
                                        writer.WriteLine($"INSERT INTO StudSpComment(CourseId,WorkGroupId,AuthorPersonId,RecipientPersonId,RequestAnonymity,CreatedDate,ModifiedDate,CommentText)Values({comment.CourseId},{comment.WorkGroupId},{comment.AuthorPersonId},{comment.RecipientPersonId},'{comment.RequestAnonymity}','{comment.CreatedDate.ToUniversalTime()}','{comment.ModifiedDate?.ToUniversalTime()}','{comment.CommentText}');");
                                    }

                                    if (wrkgrp.MpCategory != MpGroupCategory.Wg4)
                                    {
                                        writer.WriteLine(
                                            $"INSERT INTO StratResponse(AssessorPersonId,AssesseePersonId,CourseId,WorkGroupId,StratPosition,ModifiedDate) values ({stratResponse.AssessorPersonId},{stratResponse.AssesseePersonId},{6},{stratResponse.WorkGroupId},{stratResponse.StratPosition},'{DateTime.Now.ToUniversalTime()}');");

                                        Debug.WriteLine(
                                            $"Member {member.StudentId} ==> Peer {peer.StudentId} ==> Strat response {stratMix.First()}");
                                        stratMix.Remove(currentStrat);
                                    }
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