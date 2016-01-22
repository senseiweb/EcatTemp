using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecat.Dal.BbWs.Course;
using Ecat.Dal.BbWs.CourseMember;
using Ecat.Models;

namespace Ecat.Dal
{
    public class CourseRepo : ICourseRepo
    {
        private readonly IBbWrapper _ws;

        static readonly ConcurrentDictionary<string, DateTime> LastCourseMemUpdateDict = new ConcurrentDictionary<string, DateTime>();
        static readonly ConcurrentDictionary<string, DateTime> LastGroupUpdateDict = new ConcurrentDictionary<string, DateTime>();
        static readonly ConcurrentDictionary<EpmeSchool, DateTime> LastCourseUpdateDict = new ConcurrentDictionary<EpmeSchool, DateTime>();

        public async Task<List<CourseMembershipVO>> GetCourseMembersById(string bbCourseId, bool forceUpdate = false)
        {
            DateTime lastUpdate;
            var hasLastUpdate = LastCourseMemUpdateDict.TryGetValue(bbCourseId, out lastUpdate);

            if (hasLastUpdate && !forceUpdate)
            {
                var timeSinceLastRequest = DateTime.Now.Subtract(lastUpdate);
                if (timeSinceLastRequest < TimeSpan.FromHours(3))
                {
                    return null;

                }
            }

            var courseMemberFilter = new MembershipFilter
            {
                filterType = (int)MembershipFilterType.LoadByCourseId,
                filterTypeSpecified = true,
            };


            var client = await _ws.GetCourseMembershipClient();

            var result = await client.getCourseMembershipAsync(bbCourseId, courseMemberFilter);

            if (result.@return.Length > 0)
            {
                LastGroupUpdateDict.AddOrUpdate(bbCourseId, lastUpdate, (key, value) => lastUpdate);
            }

            return result.@return.ToList();
        }

        public async Task<List<CourseVO>> GetBbCourses(EpmeSchool school = EpmeSchool.Bcee, bool forceUpdate = false)
        {
            DateTime lastUpdate;
            var hasLastUpdate = LastCourseUpdateDict.TryGetValue(school, out lastUpdate);

            if (!hasLastUpdate && school != EpmeSchool.Bcee)
            {
                hasLastUpdate = LastCourseUpdateDict.TryGetValue(school, out lastUpdate);
            }

            if (hasLastUpdate && !forceUpdate)
            {
                var timeSinceLastRequest = DateTime.Now.Subtract(lastUpdate);
                if (timeSinceLastRequest < TimeSpan.FromHours(3))
                {
                    return null;

                }
            }

            var epmeCatIds = (school == EpmeSchool.Bcee)
                ? EcMapSchCategory.CatIdBySchool.Select(schoolCat => schoolCat.Value)
                : EcMapSchCategory.CatIdBySchool.Where(schoolCat => schoolCat.Key == school)
                    .Select(schoolCat => schoolCat.Value);

            var courseFilter = new CourseFilter
            {
                available = 1, //0:false/1:true/2:all 
                availableSpecified = true,
                filterType = (int)CourseFilterType.LoadByCatId,
                filterTypeSpecified = true,
                categoryIds = epmeCatIds.ToArray()
            };

            var client = await _ws.GetCourseClient();

            var result = await client.getCourseAsync(courseFilter);

            if (result.@return.Length > 0)
            {
                LastCourseUpdateDict.AddOrUpdate(school, DateTime.Today, (key, date) => DateTime.Today);
            }

            return result.@return.ToList();
        }

        public async Task<List<GroupVO>> GetBbCourseGroup(string bbCourseId, bool forceUpdate = false)
        {

            DateTime lastUpdate;
            var hasLastUpdate = LastGroupUpdateDict.TryGetValue(bbCourseId, out lastUpdate);

            if (hasLastUpdate && !forceUpdate)
            {
                var timeSinceLastRequest = DateTime.Now.Subtract(lastUpdate);
                if (timeSinceLastRequest < TimeSpan.FromHours(3))
                {
                    return null;

                }
            }

            var groupFilter = new GroupFilter
            {
                filterType = 2, //1 = By Id, 2 = By CourseId, 3 = By UserId
                filterTypeSpecified = true,
            };


            var client = await _ws.GetCourseClient();

            var result = await client.getGroupAsync(bbCourseId, groupFilter);

            if (result.@return.Length > 0)
            {
                LastGroupUpdateDict.AddOrUpdate(bbCourseId, lastUpdate, (key, value) => lastUpdate);
            }

            return result.@return.ToList();
        }

        public CourseRepo(IBbWrapper ws)
        {
            _ws = ws;
        }

    }
}
