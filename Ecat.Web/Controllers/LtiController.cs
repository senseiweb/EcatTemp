using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Mvc;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.UserMod.Core;
using Ecat.Web.Provider;
using LtiLibrary.AspNet.Extensions;
using LtiLibrary.Core.Lti1;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ecat.Web.Controllers
{
    public class LtiController : Controller
    {
        private readonly IUserLogic _userLogic;

        public LtiController(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }
     
        // GET: Lti
        public async Task<ActionResult> Secure()
        {
            var isLti = Request.IsAuthenticatedWithLti();
            if (!isLti)
            {
                return null;
            }

            var ltiRequest = new LtiRequest();

            ltiRequest.ParseRequest(Request);

            var person = new Person();

            try
            {
                person = await _userLogic.ProcessLtiUser(ltiRequest);
            }
            catch (InvalidEmailException ex)
            {
                ViewBag.Error = ex.Message + "\n\n Please update your email address in both Blackboard and AU Portal to use ECAT.";
                return View();
            }
            catch (UserUpdateException) {
                ViewBag.Error = "There was an error updating your account with the information from Blackboard. Please try again.";
                return View();
            }
            
            var token = new LoginToken
            {
                PersonId = person.PersonId,
                Person = person,
                TokenExpire = DateTime.Now.Add(TimeSpan.FromHours(24)),
                TokenExpireWarning = DateTime.Now.Add(TimeSpan.FromHours(23)),
            };

            var identity = UserAuthToken.GetClaimId;
            identity.AddClaim(new Claim(ClaimTypes.PrimarySid, token.PersonId.ToString()));

            switch (person.MpInstituteRole)
            {
                case MpInstituteRoleId.Faculty:
                    person.Faculty = null;
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.Faculty.ToString()));
                    break;
                case MpInstituteRoleId.Student:
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.Student.ToString()));
                    break;
                default:
                    identity.AddClaim(new Claim(ClaimTypes.Role, RoleMap.External.ToString()));
                    break;
            }

            var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());

            ticket.Properties.IssuedUtc = DateTime.Now;
            ticket.Properties.ExpiresUtc = DateTime.Now.AddHours(24);

            token.AuthToken = AuthServerOptions.OabOpts.AccessTokenFormat.Protect(ticket);

            ViewBag.User = JsonConvert.SerializeObject(token, Formatting.None,
                 new JsonSerializerSettings
                 {
                     ContractResolver = new CamelCasePropertyNamesContractResolver(),
                     ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                 });

            return View();
        }

        //public async Task<string> Ping2()
        //{

        //     var bbWsCnet = new BbWsCnet();

        //    var courseClient = await bbWsCnet.GetCourseClient();

        //    var courseFilter = new CourseFilter
        //    {
        //        filterType = (int)CourseFilterType.LoadByCatId,
        //        filterTypeSpecified = true,
        //        categoryIds = new[] { StaticAcademy.Ecat.BbCategoryId }
        //    };

        //    var crseQuery = await courseClient.getCourseAsync(courseFilter);

        //    using (var ctx = new EcatContext())
        //    {

        //        var existingCourse = await
        //            ctx.Courses.FirstOrDefaultAsync(crse => crse.AcademyId == StaticAcademy.Ecat.Id);

        //        if (existingCourse == null)
        //        {

        //            existingCourse = new Course
        //            {
        //                AcademyId = StaticAcademy.Ecat.Id,
        //                Name = "Not Assigned",
        //                ClassNumber = "16-Test",
        //                GradReportPublished = false,
        //                StartDate = DateTime.Now,
        //                GradDate = DateTime.Now.AddDays(1),
        //            };
        //        }

        //        if (existingCourse.Id == 0)
        //        {

        //            var bbEcatCourse = crseQuery.@return[0];
        //            existingCourse.BbCourseId = bbEcatCourse.id;

        //        await ctx.SaveChangesAsync();

        //        }

        //        var groupFilter = new GroupFilter
        //        {
        //            filterTypeSpecified = true,
        //            filterType = 2
        //        };

        //        var groupQuery = await courseClient.getGroupAsync(existingCourse.BbCourseId, groupFilter);

        //        var bbGroups = groupQuery.@return;

        //        if (bbGroups == null || bbGroups.Length == 0) return null;

        //        bbGroups = bbGroups.Where(gl => gl.title.StartsWith("BC") || gl.title == "Instructor Cadre").ToArray();

        //        var existingWorkGroups =
        //            await ctx.WorkGroups.Where(wg => wg.CourseId == existingCourse.Id).ToListAsync();

        //        var wgList = bbGroups
        //            .Where(bbg => bbg.title.ToLower().StartsWith("bc"))
        //            .Where(bbg => !existingWorkGroups
        //                .Select(wg => wg.BbGroupId)
        //                .Contains(bbg.id)).Select(grp =>
        //                {
        //                    var bo = grp.title.Split('-');
        //                    string category;
        //                    var modelId = 0;
        //                    var assignedInstr = 0;
        //                    switch (bo[0])
        //                    {
        //                        case MpGroupCategory.Wg1:
        //                            category = MpGroupCategory.Wg1;
        //                            modelId = 4;
        //                            assignedInstr = 8;
        //                            break;
        //                        case MpGroupCategory.Wg2:
        //                            category = MpGroupCategory.Wg2;
        //                            modelId = 6;
        //                            assignedInstr = 10;
        //                            break;
        //                        case MpGroupCategory.Wg3:
        //                            category = MpGroupCategory.Wg3;
        //                            modelId = 7;
        //                            assignedInstr = 8;
        //                            break;
        //                        case MpGroupCategory.Wg4:
        //                            category = MpGroupCategory.Wg4;
        //                            modelId = 7;
        //                            assignedInstr = 8;
        //                            break;
        //                        default:
        //                            category = MpGroupCategory.None;
        //                            break;
        //                    }
        //                    return new WorkGroup
        //                    {
        //                        CourseId = existingCourse.Id,
        //                        MpCategory = category,
        //                        WgModelId = modelId,
        //                        AssignedSpInstrId = assignedInstr,
        //                        DefaultName = bo[2],
        //                        GroupNumber = bo[1].Substring(1),
        //                        IsPrimary = bo[0] == MpGroupCategory.Wg1,
        //                        BbGroupId = grp.id,
        //                        ModifiedDate = DateTime.Now.ToUniversalTime(),
        //                        MpSpStatus = MpSpStatus.Open
        //                    };
        //                }).ToList();

        //        foreach (var wg in wgList)
        //        {
        //            ctx.WorkGroups.Add(wg);
        //            await ctx.SaveChangesAsync();
        //        }


        //        var grpMemberFilter = new MembershipFilter
        //        {
        //            filterType = (int) GrpMemFilterType.LoadByGrpId,
        //            filterTypeSpecified = true,
        //            groupIds = bbGroups.Select(grp => grp.id).Distinct().ToArray()
        //        };

        //        var crseMemberFilter = new MembershipFilter
        //        {
        //            filterType = (int) GrpMemFilterType.LoadByCourseId,
        //            filterTypeSpecified = true,
        //            courseIds = new[] {existingCourse.BbCourseId}
        //        };

        //        var courseMemClient = await bbWsCnet.GetMemClient();

        //        var grpMemQuery =
        //            await courseMemClient.getGroupMembershipAsync(existingCourse.BbCourseId, grpMemberFilter);

        //        var crseMemQuery =
        //            await courseMemClient.getCourseMembershipAsync(existingCourse.BbCourseId, crseMemberFilter);

        //        var grpMems = grpMemQuery.@return;

        //        var crseMems = crseMemQuery.@return;

        //        var userFilter = new UserFilter
        //        {
        //            filterTypeSpecified = true,
        //            filterType = (int) UserFilterType.UserByCourseIdWithAvailability,
        //            courseId = new [] {existingCourse.BbCourseId} 
        //        };

        //        var userClient = await bbWsCnet.GetUserClient();

        //        var userQuery = await userClient.getUserAsync(userFilter);

        //        //var ecatCourseRoster = ctx.People
        //        //    .Where(person => crseMems.Select(cm => cm.id).Contains(person.BbUserId))
        //        //    .Include(person => person.Student)
        //        //    .Include(person => person.Faculty);

        //        var bbCourseUsers = userQuery.@return;

        //        //var bbFacultyGroup = bbGroups.First(bg => bg.title == "Instructor Cadre");

        //        //var bbFaculty = grpMems.Select(gm => gm.groupId == bbFacultyGroup.id);

        //        var newUsers = bbCourseUsers.Select(bcu => new Person
        //        {
        //            BbUserId = bcu.id,
        //            FirstName = bcu.extendedInfo.givenName,
        //            LastName = bcu.extendedInfo.familyName,
        //            MpGender = MpGender.Unk,
        //            MpAffiliation = MpAffiliation.Usaf,
        //            MpPaygrade = MpPaygrade.E7,
        //            MpComponent = MpComponent.Active,
        //            Email = bcu.extendedInfo.emailAddress,
        //            RegistrationComplete = true,
        //            MpInstituteRole =
        //                bcu.extendedInfo.familyName.ToLower().Contains("instructor")
        //                    ? MpInstituteRoleId.Faculty
        //                    : MpInstituteRoleId.Student
        //        }).ToList();

        //        var i = 0;
        //        foreach (var user in newUsers)
        //        {
        //            user.Email = i + user.Email;
        //            i += 1;
        //            Debug.WriteLine(user.Email);
        //            ctx.People.Add(user);
        //        }

        //        await ctx.SaveChangesAsync();


        //        foreach (var user in newUsers)
        //        {
        //            if (user.MpInstituteRole == MpInstituteRoleId.Faculty)
        //            {
        //                user.Faculty = new ProfileFaculty
        //                {
        //                    AcademyId = StaticAcademy.Ecat.Id,
        //                    IsCourseAdmin = false,
        //                    IsReportViewer = false,
        //                    PersonId = user.PersonId
        //                };
        //            }
        //            else if (user.MpInstituteRole == MpInstituteRoleId.Student)
        //            {
        //                user.Student = new ProfileStudent
        //                {
        //                    PersonId =  user.PersonId,
        //                    Commander = "Somebody",
        //                    CommanderEmail = "me@me.com"
        //                };
        //            }
        //        }

        //        foreach (var user in newUsers)
        //        {
        //            user.Security = new Security
        //            {
        //                BadPasswordCount = 0,
        //                ModifiedDate = DateTime.Now,
        //                ModifiedById = user.PersonId,
        //                PasswordHash = "1200:zlz/+uf+L2sOQcNGrOb+B5LvOxS8m3d0yvZ/toDxN++PYrOR:QU+XS2TGodnR5lY7hhTnEROa7kTFBq2n165KOjovUZs="
        //            };

        //            if (user.MpInstituteRole == MpInstituteRoleId.Faculty)
        //            {
        //                var fic = new FacultyInCourse
        //                {
        //                    CourseId = existingCourse.Id,
        //                    FacultyPersonId = user.PersonId,
        //                    IsDeleted = false
        //                };
        //                ctx.FacultyInCourses.Add(fic);
        //            }
        //            else if (user.MpInstituteRole == MpInstituteRoleId.Student)
        //            {
        //                var sic = new StudentInCourse
        //                {
        //                    CourseId = existingCourse.Id,
        //                    StudentPersonId = user.PersonId,
        //                    IsDeleted = false
        //                };
        //                ctx.StudentInCourses.Add(sic);

        //                var ecatCrseMem = crseMems.First(cm => cm.userId == user.BbUserId);

        //                var ecatGrpMems = grpMems.Where(gm => gm.courseMembershipId == ecatCrseMem.id);

        //                var studGrps =
        //                    existingWorkGroups.Where(wg => ecatGrpMems.Select(egm => egm.groupId).Contains(wg.BbGroupId))
        //                        .ToList();

        //                var crseStudInGroup = studGrps.Select(sg => new CrseStudentInGroup
        //                {
        //                    StudentId = user.PersonId,
        //                    WorkGroupId = sg.Id,
        //                    CourseId = existingCourse.Id,
        //                    ModifiedDate = DateTime.Now,
        //                    HasAcknowledged = false,
        //                    BbCrseStudGroupId = ecatGrpMems.First(egm => egm.groupId == sg.BbGroupId).groupMembershipId
        //                });

        //                foreach (var csig in crseStudInGroup)
        //                {
        //                    ctx.StudentInGroups.Add(csig);
        //                }
        //            }
        //        }

        //        await ctx.SaveChangesAsync();
        //    }
        //    return "Ping 2";
        //} 

        public ActionResult Ping()
        {
            return View();
        }
    }
}


