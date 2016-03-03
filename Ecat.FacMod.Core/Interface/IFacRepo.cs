using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public interface IFacRepo
    {
        string Metadata { get; }
        SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards);
        IQueryable<FacultyInCourse> GetFacultyCourses { get; }
        IQueryable<WorkGroup> GetCourseWorkGroups { get; }
        IQueryable<CrseStudentInGroup> GetWorkGroupMembers(bool addAssessment);
        void AddCourseWorkgroups(Course course);
        IQueryable<CommentCount> AuthorCommentCounts(List<int> authorIds, int workGroupId);
        List<int> CanWgPublish(List<int> wgIds);
    }
}
