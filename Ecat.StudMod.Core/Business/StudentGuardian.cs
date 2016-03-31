using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;

namespace Ecat.StudMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public class StudentGuardian
    {

        private readonly EFContextProvider<StudCtx> _efCtx;
        private readonly Person _loggedInUser;
        private readonly Type _tStudComment = typeof(StudSpComment);
        private readonly Type _tStudCommentFlag = typeof(StudSpComment);
        private readonly Type _tSpResponse = typeof(SpResponse);
        private readonly Type _tStratResponse = typeof(StratResponse);

        public StudentGuardian(EFContextProvider<StudCtx> efCtx, Person loggedInUser)
        {
            _efCtx = efCtx;
            _loggedInUser = loggedInUser;
        }

        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {

            var unAuthorizedMaps = saveMap.Where(map => map.Key != _tStudComment &&
                                                        map.Key != _tSpResponse &&
                                                        map.Key != _tStratResponse &&
                                                        map.Key != _tStudCommentFlag)
                                                        .ToList();

            saveMap.RemoveMaps(unAuthorizedMaps);

            var courseMonitorEntities = saveMap.MonitorCourseMaps().ToList();

            if (courseMonitorEntities.Any()) ProcessCourseMonitoredMaps(courseMonitorEntities);

            var workGroupMonitorEntities = saveMap.MonitorWgMaps().ToList();

            if (workGroupMonitorEntities.Any()) ProcessWorkGroupMonitoredMaps(workGroupMonitorEntities);

            saveMap.AuditMap(_loggedInUser.PersonId);
            saveMap.SoftDeleteMap(_loggedInUser.PersonId);
            return saveMap;
        }

        private void ProcessCourseMonitoredMaps(List<EntityInfo> infos)
        {
            var courseMonitorEntities = infos.Select(info => info.Entity).OfType<ICourseMonitored>();
            var courseIds = courseMonitorEntities.Select(cme => cme.CourseId);

            var pubCrseId = _efCtx.Context.Courses
                .Where(crse => courseIds.Contains(crse.Id) && crse.GradReportPublished)
                .Select(crse => crse.Id);

            if (!pubCrseId.Any()) return;

            var errors = from info in infos
                         let crseEntity = (ICourseMonitored)info.Entity
                         where pubCrseId.Contains(crseEntity.CourseId)
                         select new EFEntityError(info, "Course Error Validation",
                                     "There was a problem saving the requested items", "Course");

            throw new EntityErrorsException(errors);
        }

        private void ProcessWorkGroupMonitoredMaps(List<EntityInfo> infos)
        {
            var wgMonitorEntities = infos.Select(info => info.Entity).OfType<IWorkGroupMonitored>();
            var wgIds = wgMonitorEntities.Select(wgme => wgme.WorkGroupId);

            var pubWgIds = _efCtx.Context.WorkGroups
                .Where(wg => wgIds.Contains(wg.Id) && wg.MpSpStatus == MpSpStatus.Published)
                .Select(wg => wg.Id);

            if (!pubWgIds.Any()) return;

            var errors = from info in infos
                         let wgEntity = (IWorkGroupMonitored)info.Entity
                         where pubWgIds.Contains(wgEntity.WorkGroupId)
                         select new EFEntityError(info, "WorkGroup Error Validation",
                                     "There was a problem saving the requested items", "WorkGroup");

            throw new EntityErrorsException(errors);
        }

    }
}
