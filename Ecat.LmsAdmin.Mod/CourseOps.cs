using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.BbWs.BbCourse;
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

            var query = await client.getCategoriesAsync(filter);
            var categories = query.@return.ToList();

            return categories.ToList();
        }

        public async Task<List<Course>> ReconcileCourses()
        {
            var courseFilter = new CourseFilter
            {
                filterTypeSpecified = true,
                filterType = (int) CourseFilterType.LoadByCatId
            };

            if (Faculty != null)
            {
                var academy = StaticAcademy.AcadLookup[Faculty.AcademyId];
                courseFilter.categoryIds = new[] {academy.BbCategoryId};
            }
            else
            {
                var ids = StaticAcademy.AcadLookup.Select(acad => acad.Value.BbCategoryId).ToArray();
                courseFilter.categoryIds = ids;
            }

            var client = await _bbWs.GetCourseClient();

            var query = await client.getCourseAsync(courseFilter);

            var queryKnownCourses = _mainCtx.Courses.AsQueryable();

            queryKnownCourses = (Faculty == null)
                ? queryKnownCourses
                : queryKnownCourses.Where(crse => crse.AcademyId == Faculty.AcademyId);

            var knownCoursesId = queryKnownCourses.Select(crse => crse.BbCourseId);

            //var newCourses = query.@return.Select(bbCourse => !knownCoursesId.Contains(bbCourse.id))
            

            return null;
        }

    }
}
