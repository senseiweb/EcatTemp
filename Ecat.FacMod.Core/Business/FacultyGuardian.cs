using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;

namespace Ecat.FacMod.Core
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;
    public class FacultyGuardian
    {

        private readonly FacCtx _facCtx;
        private readonly EFContextProvider<FacCtx> _efCtx; 
        private readonly Person _loggedInUser;
        private readonly Type _tWg = typeof(WorkGroup);
        private readonly Type _tFacComment = typeof (FacSpComment);
        private readonly Type _tFacStratResp = typeof (FacStratResponse);
        private readonly Type _tFacCommentFlag = typeof (FacSpCommentFlag);
        private readonly Type _tStudCommentFlag = typeof (StudSpCommentFlag);
        private readonly Type _tFacSpResp = typeof (FacSpResponse);

        public FacultyGuardian(FacCtx facCtx, EFContextProvider<FacCtx> efCtx,Person loggedInUser)
        {
            //_facCtx = facCtx;
            _efCtx = efCtx;
            _loggedInUser = loggedInUser;
        }
      
        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {

            var unAuthorizedMaps = saveMap.Where(map => map.Key != _tWg &&
                                                        map.Key != _tFacComment &&
                                                        map.Key != _tFacStratResp &&
                                                        map.Key != _tFacSpResp &&
                                                        map.Key != _tStudCommentFlag &&
                                                        map.Key != _tFacCommentFlag)
                                                        .ToList();
            //.Select(map => map.Key);

            saveMap.RemoveMaps(unAuthorizedMaps);

            if (saveMap.ContainsKey(_tWg))
            {
                var workGroupMap = ProcessWorkGroup(saveMap[_tWg]);
                saveMap.MergeMap(workGroupMap);
            }

            saveMap.AuditMap(_loggedInUser.PersonId);
            saveMap.SoftDeleteMap(_loggedInUser.PersonId);
            return saveMap;
        }

        private SaveMap ProcessWorkGroup(List<EntityInfo> workGroupInfos)
        {

            var publishingWgs = workGroupInfos
                .Where(info => info.OriginalValuesMap.ContainsKey("MpSpStatus"))
                .Select(info => info.Entity)
                .OfType<WorkGroup>()
                .Where(wg => wg.MpSpStatus == MpSpStatus.Published).ToList();

            var wgSaveMap = new Dictionary<Type, List<EntityInfo>> {{ _tWg, workGroupInfos }} ;

            if (!publishingWgs.Any()) return wgSaveMap;


            var svrWgIds = publishingWgs.Select(wg => wg.Id);
            var publishResultMap = WorkGroupPublish.Publish(wgSaveMap, svrWgIds, _loggedInUser.PersonId, _efCtx);

            wgSaveMap.MergeMap(publishResultMap);

            return wgSaveMap;
        }
    }
}
