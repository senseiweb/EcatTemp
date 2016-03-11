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
    public partial class FacultyGuardian
    {

        private readonly FacCtx _facCtx;
        private readonly Person _loggedInUser;
        private Type tWg = typeof(WorkGroup);
        private Type tFacComment = typeof (FacSpComment);
        private Type tFacStratResp = typeof (FacStratResponse);
        private Type tFacCommentFlag = typeof (FacSpCommentFlag);
        private Type tStudCommentFlag = typeof (StudSpCommentFlag);
        private Type tFacSpResp = typeof (FacSpResponse);

        public FacultyGuardian(FacCtx facCtx, Person loggedInUser)
        {
            _facCtx = facCtx;
            _loggedInUser = loggedInUser;
        }
      
        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {

            var unAuthorizedMaps = saveMap.Where(map => map.Key != tWg &&
                                                        map.Key != tFacComment &&
                                                        map.Key != tFacStratResp &&
                                                        map.Key != tFacSpResp &&
                                                        map.Key != tStudCommentFlag &&
                                                        map.Key != tFacCommentFlag)
                                                        .Select(map => map.Key);

            if (saveMap.HasMap(tWg))
            {
                saveMap[tWg] = ProcessWorkGroup(saveMap[tWg]);
            }

            var workGroupInfos = saveMap[wgMapKey];

            saveMap.RemoveMaps(unAuthorizedMaps);
            saveMap.AuditMaps(_loggedInUser.PersonId);
            saveMap.SoftDeleteMap(_loggedInUser.PersonId);
            return saveMap;
        }

        private List<EntityInfo> ProcessWorkGroup(List<EntityInfo> workGroupInfos)
        {
            foreach (var info in workGroupInfos)
            {
                var wg = info.Entity as WorkGroup;

                if (wg == null)
                {
                    continue;
                }

                if (info.OriginalValuesMap.ContainsKey("MpSpStatus") && wg.MpSpStatus == MpSpStatus.Published)
                {
                    PublishWorkGroup(wg, info);
                }
            }


            //Retrive our own version of the workgroup from the db with related items
            var svrWg = _facCtx.WorkGroups
                .Where(grp => grp.Id == wg.Id && wg.MpSpStatus == MpSpStatus.UnderReview)
                .Include(grp => grp.WgModel)
                .Include(grp => grp.SpResults)
                .Include(grp => grp.SpStratResults)
                .Include(grp => grp.GroupMembers)
                .Include(grp => grp.SpResponses)
                .Include(grp => grp.SpStratResponses)
                .Include(grp => grp.FacSpResponses)
                .Include(grp => grp.FacStratResponses)
                .Single();
        }

      
    }
}
