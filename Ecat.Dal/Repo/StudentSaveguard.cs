using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.ContextProvider;
using Ecat.Dal.Context;
using Ecat.Models;

namespace Ecat.Dal
{
    using Breeze.ContextProvider.EF6;
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class StudentSaveguard
    {
        private readonly EcatCtx _serverCtx;
        private readonly EcPerson _loggedInPerson;
        //private readonly StudentRepo _stuRepo;
        private SaveMap _saveMapRef;
        //TODO: create studentSgAttr?
        //private static readonly Dictionary<string, List<UserRoleType>> _userSgAttr;

        //TODO: Change this to actually be relevant?
        //static StudentSaveguard()
        //{
        //    _userSgAttr = new Dictionary<string, List<UserRoleType>>();

        //    var properties = typeof(EcPerson).GetProperties();

        //    foreach (var propertyInfo in properties)
        //    {
        //        var attrs = propertyInfo.GetCustomAttributes(true);

        //        foreach (var attr in attrs)
        //        {
        //            var userSgAttribute = attr as UserSgAttribute;

        //            if (userSgAttribute == null) continue;

        //            var propName = userSgAttribute.Name;
        //            var allowTypes = userSgAttribute.Allowed.ToList();

        //            _userSgAttr.Add(propName, allowTypes);
        //        }
        //    }
        //}

        public StudentSaveguard(EcatCtx serverCtx, EcPerson person)//, StudentRepo stuRepo)
        {
            //_stuRepo = stuRepo;
            _serverCtx = serverCtx;
            if (person.PersonId == 0)
            {
                //TODO: ?
                //Check for student here or before this? No need to go into the rest if they aren't a logged in student
                //Check for UserRoleType.BbDefined?
                throw new NotImplementedException();
            }
            else { _loggedInPerson = person; }
        }

        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {
            _saveMapRef = saveMap;

            foreach (var nonUserEntity in saveMap.Where(entry => entry.Key != typeof(SpAssessResponse) &&
             entry.Key != typeof(SpStratResponse) && 
             entry.Key != typeof(SpComment)).ToList())
            {
                saveMap.Remove(nonUserEntity.Key);
            }

            if (!saveMap.Any())
            {
                var infos = saveMap.Values.SelectMany(infoList => infoList).ToList();

                var errors = infos.Select(info => new EFEntityError(info, "Unauthorized Action", "These datatypes are not allowed to be processed on this endpoint!", null));
                throw new EntityErrorsException(errors);
            }

            //TODO: Disallow deletions?

            var spAssessResponseEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpAssessResponse)).Key;

            if (spAssessResponseEntityKey != null)
            {
                saveMap[spAssessResponseEntityKey] = ProcessSpAssessResponse(saveMap[spAssessResponseEntityKey]);
            }

            var spStratResponseEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpStratResponse)).Key;

            if (spStratResponseEntityKey != null)
            {
                saveMap[spStratResponseEntityKey] = ProcessSpStratResponse(saveMap[spStratResponseEntityKey]);
            }

            var spCommentEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpComment)).Key;

            if (spCommentEntityKey != null)
            {
                saveMap[spCommentEntityKey] = ProcessSpComment(saveMap[spCommentEntityKey]);
            }

            return saveMap;
        }

        private List<EntityInfo> ProcessSpAssessResponse(List<EntityInfo> spAssessEntityInfos)
        {
            //List<EcCourseMember> groupMemebers = await _stuRepo.GetCourseMems(_loggedInPerson.PersonId);
            foreach (var info in spAssessEntityInfos)
            {
                var assessEntity = info.Entity as SpAssessResponse;
                var vc = new ValidationContext(info.Entity);

                if (assessEntity?.AssessorId == _loggedInPerson.PersonId) { }
                List<EcGroupMember> groupMembershipsList = _serverCtx.GroupMembers
                    .Where(gm => gm.MemberId == _loggedInPerson.PersonId).ToList();
                EcGroupMember groupMembership = groupMembershipsList.Find(gm => gm.GroupId == assessEntity.Assessor.GroupId);
                if (groupMembership != null) { }
                List<EcGroup> groupList = _serverCtx.Groups
                    .Where(g => g.Id == groupMembership.GroupId).ToList();
                EcGroup group = groupList.FirstOrDefault();
                if (group != null) { }
                List<EcGroupMember> groupMemebersList = _serverCtx.GroupMembers
                    .Where(gm => gm.GroupId == group.Id).ToList();
                if (groupMemebersList.Find(gm => gm.MemberId == assessEntity.AssesseeId) != null) { }


            }

            return spAssessEntityInfos;
        }

        private List<EntityInfo> ProcessSpStratResponse(List<EntityInfo> spStratEntityInfos)
        {


            return spStratEntityInfos;
        }

        private List<EntityInfo> ProcessSpComment(List<EntityInfo> spCommentInfos)
        {


            return spCommentInfos;
        }
    }
}