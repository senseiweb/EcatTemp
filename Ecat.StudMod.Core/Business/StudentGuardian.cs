﻿using System;
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
using Ecat.StudMod.Core.Guards;

namespace Ecat.StudMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public class StudentGuardian
    {

        private readonly EFContextProvider<StudCtx> _efCtx;
        private readonly Person _loggedInUser;
        private readonly Type _tStudInGroup = typeof (CrseStudentInGroup);
        private readonly Type _tStudComment = typeof(StudSpComment);
        private readonly Type _tStudCommentFlag = typeof(StudSpCommentFlag);
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
                                                        map.Key != _tStudInGroup &&
                                                        map.Key != _tStratResponse &&
                                                        map.Key != _tStudCommentFlag)
                                                        .ToList();

            saveMap.RemoveMaps(unAuthorizedMaps);

            //Process any monitored entities to see if saves are allowed.
            var courseMonitorEntities = saveMap.MonitorCourseMaps()?.ToList();
            var workGroupMonitorEntities = saveMap.MonitorWgMaps()?.ToList();

            if (courseMonitorEntities != null || workGroupMonitorEntities != null)
            {
                var monitorGuard = new GuardMonitored(_efCtx);
                if (courseMonitorEntities != null) monitorGuard.ProcessCourseMonitoredMaps(courseMonitorEntities);
                if (workGroupMonitorEntities != null) monitorGuard.ProcessWorkGroupMonitoredMaps(workGroupMonitorEntities);
            }

            //Process studInGroup to ensure that only the logged student' is being handled.
            if (saveMap.ContainsKey(_tStudInGroup))
            {
                var infos = (from info in saveMap[_tStudInGroup]
                    let sig = info.Entity as CrseStudentInGroup
                    where sig != null && sig.StudentId == _loggedInUser.PersonId
                    where info.EntityState == EntityState.Modified
                    where info.OriginalValuesMap.ContainsKey("HasAcknowledged")
                    select info).ToList();

                if (infos.Any())
                {
                    foreach (var info in infos)
                    {
                        info.OriginalValuesMap = new Dictionary<string, object>()
                        {{"HasAcknowledged", null}};
                    }

                    saveMap[_tStudInGroup] = infos;
                }
                else
                {
                    saveMap.Remove(_tStudInGroup);
                }
            }

            saveMap.AuditMap(_loggedInUser.PersonId);
            saveMap.SoftDeleteMap(_loggedInUser.PersonId);
            return saveMap;
        }
    }
}
