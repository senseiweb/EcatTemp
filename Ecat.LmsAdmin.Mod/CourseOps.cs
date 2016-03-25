using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Diagnostics.Contracts;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.BbWs.BbCourse;
using Ecat.Shared.DbMgr.BbWs.BbMbrs;
using Ecat.Shared.DbMgr.BbWs.BbUser;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.LmsAdmin.Mod
{
    public class CourseOps : ILAdminCourseOps
    {
        private readonly EcatContext _mainCtx;
        private readonly BbWsCnet _bbWs;
        public ProfileFaculty Faculty { get; set; }

        public CourseOps(EcatContext mainCtx, BbWsCnet bbWs)
        {
            _mainCtx = mainCtx;
            _bbWs = bbWs;
        }

        public async Task<List<CategoryVO>> GetBbCategories()
        {
            var client = await _bbWs.GetCourseClient();
            var filter = new CategoryFilter
            {
                filterType = (int)CategoryFilterTpe.GetAllCourseCategory,
                filterTypeSpecified = true
            };
            var autoRetry = new Retrier<getCategoriesResponse>();
            var query = await autoRetry.Try(client.getCategoriesAsync(filter), 3);
            var categories = query.@return.ToList();

            return categories.ToList();
        }

        public async Task<List<Course>> ReconcileCourses()
        {
            if (!Faculty.IsCourseAdmin || Faculty.Person.MpInstituteRole != MpInstituteRoleId.HqAdmin) throw new HttpRequestException("Member is not a course admin");

            var courseFilter = new CourseFilter
            {
                filterTypeSpecified = true,
                filterType = (int) CourseFilterType.LoadByCatId
            };

            if (Faculty != null)
            {
                var academy = StaticAcademy.AcadLookupById[Faculty.AcademyId];
                courseFilter.categoryIds = new[] {academy.BbCategoryId};
            }
            else
            {
                var ids = StaticAcademy.AcadLookupById.Select(acad => acad.Value.BbCategoryId).ToArray();
                courseFilter.categoryIds = ids;
            }

            var client = await _bbWs.GetCourseClient();

            var autoRetry = new Retrier<getCourseResponse>();
            var query = await autoRetry.Try(client.getCourseAsync(courseFilter), 3);
            var bbCoursesResult = query.@return;

            if (bbCoursesResult == null) throw new InvalidDataException("No Bb Responses received");

            var queryKnownCourses = _mainCtx.Courses.AsQueryable();

            queryKnownCourses = (Faculty == null)
                ? queryKnownCourses
                : queryKnownCourses.Where(crse => crse.AcademyId == Faculty.AcademyId);

            var knownCoursesIds = queryKnownCourses.Select(crse => crse.BbCourseId).ToList();

            foreach (var nc in bbCoursesResult.Where(bbc => !knownCoursesIds.Contains(bbc.id)).Select(bbc => new Course
            {
                BbCourseId = bbc.id,
                AcademyId = "New",
                Name = bbc.name,
                StartDate = DateTime.Now,
                GradDate = DateTime.Now.AddDays(25)
            }))
            {
                _mainCtx.Courses.Add(nc);
            }

            var success = await _mainCtx.SaveChangesAsync() > 1;

            return success ? _mainCtx.Courses.Local.ToList() : null;
        }

        public async Task<List<Person>> ReconcileCourseMembers(int courseId)
        {
            var ecatCourse = await _mainCtx.Courses.Where(crse => crse.Id == courseId).Select(crse => new
            {
                crse,
                Faculty = crse.Faculty.Select(fac => new
                {
                    id = fac.FacultyPersonId,
                    bbId = fac.FacultyProfile.Person.BbUserId,
                    canDelete = !fac.FacSpComments.Any() &&
                    !fac.FacSpResponses.Any() &&
                    !fac.FacStratResponse.Any() &&
                    !fac.FlaggedSpComments.Any()
                }),
                Students = crse.StudentsInCourse.Select(sic => new 
                {
                    id = sic.StudentPersonId,
                    bbId = sic.Student.Person.BbUserId,
                    canDelete = !sic.WorkGroupEnrollments.Any() && 
                        !sic.KcResponses.Any()
                })
            }).SingleOrDefaultAsync();

            Contract.Assert(ecatCourse != null);

            var autoRetry = new Retrier<getCourseMembershipResponse>();
            var client = await _bbWs.GetMemClient();

            var courseMemFilter = new MembershipFilter
            {
                filterTypeSpecified = true,
                filterType = (int)CrseMembershipFilterType.LoadByCourseId,
            };

            var query = await autoRetry.Try(client.getCourseMembershipAsync(ecatCourse.crse.BbCourseId, courseMemFilter), 3);

            var courseMems = query.@return;

            var existingCrseUserIds = ecatCourse.Faculty.Select(fac => fac.bbId).ToList();
            existingCrseUserIds.AddRange(ecatCourse.Students.Select(sic => sic.bbId));

            var newMembers = courseMems.Where(cm => !existingCrseUserIds.Contains(cm.userId)).Select(cm => cm.userId).ToArray();

            if (newMembers.Length != 0)
            {
                var userFilter = new UserFilter
                {
                    filterTypeSpecified = true,
                    filterType = (int)UserFilterType.UserByIdWithAvailability,
                    available = true,
                    availableSpecified = true,
                    id = newMembers
                };
                var userClient = await _bbWs.GetUserClient();
                var autoRetryUsers = new Retrier<getUserResponse>();
                var userQuery = await autoRetryUsers.Try(userClient.getUserAsync(userFilter), 3);
                var bbUsers = userQuery.@return;
                await AddNewUsers(bbUsers);
            }

            //Search existing users ids to find those not in the bb course members record
            var usersBbIdsToRemove = existingCrseUserIds.Where(ecu => !courseMems.Select(cm => cm.id).Contains(ecu)).ToList();

            //Get the faculty users to remvoe via their bbUserId
            //var facultyToRemove = ecatCourse.Faculty


            return null;
        }

        private async Task AddNewUsers(IEnumerable<UserVO> bbUsers)
        {
            foreach (var user in bbUsers.Select(bbu => new Person
            {
                MpInstituteRole = MpInstituteRoleId.Undefined,
                BbUserId = bbu.id,
                Email = bbu.extendedInfo.emailAddress,
                IsActive = true,
                LastName = bbu.extendedInfo.familyName,
                FirstName = bbu.extendedInfo.givenName,
                MpGender = MpGender.Unk,
                MpAffiliation = MpAffiliation.Unk,
                MpComponent = MpComponent.Unk,
                RegistrationComplete = false,
                MpPaygrade = MpPaygrade.Unk,
            }))
            {
                _mainCtx.People.Add(user);
            }

            await _mainCtx.SaveChangesAsync();
        }

        //private async Task RemoveOrFlagUsers(IEnumerable<Person> )
        //{

        //}
    }
}
