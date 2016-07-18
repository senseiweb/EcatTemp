﻿using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.Context;

namespace Ecat.UserMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public class UserGuardian
    {

        private readonly EFContextProvider<EcatContext> _efCtx;
        private readonly Person _loggedInUser;
        private readonly Type _tPerson = typeof(Person);
        private readonly Type _tProfileExternal = typeof(ProfileExternal);
        private readonly Type _tProfileFaculty = typeof(ProfileFaculty);
        private readonly Type _tProfileStaff = typeof(ProfileStaff);
        private readonly Type _tProfileStudent = typeof(ProfileStudent);
        private readonly Type _tProfileSecurity = typeof(Security);


        public UserGuardian(EFContextProvider<EcatContext> efCtx, Person loggedInUser)
        {
            _efCtx = efCtx;
            _loggedInUser = loggedInUser;
        }

        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {

            var unAuthorizedMaps = saveMap.Where(map => map.Key != _tPerson &&
                                                        map.Key != _tProfileExternal &&
                                                        map.Key != _tProfileFaculty &&
                                                        map.Key != _tProfileStudent &&
                                                        map.Key != _tProfileSecurity &&
                                                        map.Key != _tProfileStaff)
                                                        .ToList();

            saveMap.RemoveMaps(unAuthorizedMaps);

            saveMap.AuditMap(_loggedInUser.PersonId);
            saveMap.SoftDeleteMap(_loggedInUser.PersonId);
            return saveMap;
        }
    }
}
