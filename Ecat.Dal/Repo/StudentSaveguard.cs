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
    using System.Diagnostics.Contracts;
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class StudentSaveguard
    {
        private readonly EcatCtx _serverCtx;
        private readonly EcPerson _loggedInPerson;
        //private readonly StudentRepo _stuRepo;
        private SaveMap _saveMapRef;
        //TODO: create studentSgAttr?
        //private static readonly Dictionary<string, List<UserRoleType>> _userSgAttr;

        //TODO: Change this to actually be relevant? Remove it? Don't seem to need it...
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
            if (person.PersonId == 0 || person.MpInstituteRole != EcMapInstituteRole.Student)
            {
                //TODO: ?
                //Check for UserRoleType.BbDefined?
                //Get a better exception?
                throw new UnauthorizedAccessException("Only users with a student role can process through here.");
            }
            else { _loggedInPerson = person; }
        }

        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {
            _saveMapRef = saveMap;

            //Check if there are any types other than those listed
            var disallowedKeys = saveMap.Where(entry => entry.Key != typeof(SpAssessResponse) &&
                entry.Key != typeof(SpStratResponse) &&
                entry.Key != typeof(SpComment));

            if (disallowedKeys.Any())
            {
                saveMap = saveMap.Except(disallowedKeys).ToDictionary(map => map.Key, map => map.Value);
            }

            if (!saveMap.Any())
            {
                var infos = disallowedKeys.SelectMany(infoList => infoList.Value).ToList();

                var errors = infos.Select(info => new EFEntityError(info, "Unauthorized Action", "These datatypes are not allowed to be processed on this endpoint!", null));
                throw new EntityErrorsException(errors);
            }

            var spAssessResponseEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpAssessResponse)).Key;

            //Grab the logged in user's list of group memberships for use in all the Process methods
            List<EcGroupMember> groupMembershipsList = _serverCtx.GroupMembers
                    .Where(gm => gm.Member.PersonId == _loggedInPerson.PersonId).ToList();

            if (spAssessResponseEntityKey != null)
            {
                saveMap[spAssessResponseEntityKey] = ProcessSpAssessResponse(saveMap[spAssessResponseEntityKey], groupMembershipsList);
            }

            var spStratResponseEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpStratResponse)).Key;

            if (spStratResponseEntityKey != null)
            {
                saveMap[spStratResponseEntityKey] = ProcessSpStratResponse(saveMap[spStratResponseEntityKey], groupMembershipsList);
            }

            var spCommentEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(SpComment)).Key;

            if (spCommentEntityKey != null)
            {
                saveMap[spCommentEntityKey] = ProcessSpComment(saveMap[spCommentEntityKey], groupMembershipsList);
            }

            return saveMap;
        }

        private List<EntityInfo> ProcessSpAssessResponse(List<EntityInfo> spAssessEntityInfos, List<EcGroupMember> groupMembershipsList)
        {
            //Check for deletion attempts
            var deleteAttempts = spAssessEntityInfos
                .Where(info => info.EntityState == EntityState.Deleted).ToList();
            spAssessEntityInfos = spAssessEntityInfos.Except(deleteAttempts).ToList();
            if (!spAssessEntityInfos.Any())
            {
                var errors = deleteAttempts.Select(info => new EFEntityError(info, "Unauthorized Action", "Students cannot delete Assessment Responses.", null));
                throw new EntityErrorsException(errors);
            }

            //Check for the assessor not being the logged in user
            var notLoggedInPerson = spAssessEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpAssessResponse;
                    Contract.Assert(responseEntity != null);

                    if (groupMembershipsList.Find(gm => gm.Id == responseEntity.AssessorId) != null)
                    {
                        return null;
                    }

                    return info;
                });

            spAssessEntityInfos = spAssessEntityInfos.Except(notLoggedInPerson).ToList();
            if (!spAssessEntityInfos.Any())
            {
                var errors = notLoggedInPerson.Select(info => new EFEntityError(info, "Unauthorized Action", "Assessor is not the logged in user.", null));
                throw new EntityErrorsException(errors);
            }

            //Check that the assessor and assessee are in the same group
            var assessorAssesseeDiffGroups = spAssessEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpAssessResponse;
                    Contract.Assert(responseEntity != null);

                    if (responseEntity.Assessor.GroupId != responseEntity.Assessee.GroupId)
                    {
                        return null;
                    }

                    return info;
                });

            spAssessEntityInfos = spAssessEntityInfos.Except(assessorAssesseeDiffGroups).ToList();
            if (!spAssessEntityInfos.Any())
            {
                var errors = assessorAssesseeDiffGroups.ToList().Select(info => new EFEntityError(info, "Unauthorized Action", "Assessor and Assessee are in different groups.", null));
                throw new EntityErrorsException(errors);
            }

            //Check that the response is a valid response
            var incorretItemResponse = spAssessEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpAssessResponse;
                    Contract.Assert(responseEntity != null);

                    var vc = new ValidationContext(info.Entity);

                    if (!Validator.TryValidateObject(info.Entity, vc, null, true))
                    {
                        return null;
                    }

                    return info;
                });

            spAssessEntityInfos = spAssessEntityInfos.Except(incorretItemResponse).ToList();
            if (!spAssessEntityInfos.Any())
            {
                var errors = incorretItemResponse.ToList().Select(info => new EFEntityError(info, "Invalid Data", "Invalid assessment item response.", null));
                throw new EntityErrorsException(errors);
            }

            //Check that the inventory on the response is a valid inventory for this group
            var invalidInventoryForGroup = spAssessEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpAssessResponse;
                    Contract.Assert(responseEntity != null);

                    //TODO: I don't think this is actually going to work... I won't have that deep inside the responseEntity
                    if (!responseEntity.RelatedInventory.Instrument.AssignedGroups.Contains(responseEntity.Assessor.Group))
                    {
                        return null;
                    }

                    return info;
                });

            spAssessEntityInfos = spAssessEntityInfos.Except(invalidInventoryForGroup).ToList();
            if (!spAssessEntityInfos.Any())
            {
                var errors = invalidInventoryForGroup.ToList().Select(info => new EFEntityError(info, "Invalid Data", "Assessment's inventory is not the same as the group's instrument", null));
                throw new EntityErrorsException(errors);
            }

            //    if (instrumentList == null || instrument == null || instrumentList.Find(i => i.Id == instrument.Id) == null)
            //    {
            //        instrumentList = _serverCtx.SpInstruments
            //            .Where(i => i.Id == group.SpInstrumentId).ToList();
            //        instrument = instrumentList.FirstOrDefault();
            //    }
            //    if (instrument == null) { } //instrument not found

            //    if (inventoryList == null || inventoryList.Find(inv => inv.InstrumentId == instrument.Id) == null)
            //    {
            //        inventoryList = _serverCtx.SpInventories
            //            .Where(inv => inv.InstrumentId == instrument.Id).ToList();
            //    }
            //    if (!inventoryList.Contains(assessEntity.RelatedInventory)) { } //spAssessResponse inventory does not match inventories assigned to group

            //}

            return spAssessEntityInfos;
        }

        private List<EntityInfo> ProcessSpStratResponse(List<EntityInfo> spStratEntityInfos, List<EcGroupMember> groupMembershipsList)
        {
            //Check for delete attempts
            var deletionAttempts = spStratEntityInfos
                .Where(info => info.EntityState == EntityState.Deleted);
            spStratEntityInfos = spStratEntityInfos.Except(deletionAttempts).ToList();
            if (!spStratEntityInfos.Any())
            {
                var errors = deletionAttempts.Select(info => new EFEntityError(info, "Unauthorized Action", "Students cannot delete Strat Responses.", null));
                throw new EntityErrorsException(errors);
            }

            //Check for the stratter not being the logged in user
            var notLoggedInPerson = spStratEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpStratResponse;
                    Contract.Assert(responseEntity != null);

                    if (groupMembershipsList.Find(gm => gm.Id == responseEntity.AssessorId) != null)
                    {
                        return null;
                    }

                    return info;
                });

            spStratEntityInfos = spStratEntityInfos.Except(notLoggedInPerson).ToList();
            if (!spStratEntityInfos.Any())
            {
                var errors = notLoggedInPerson.Select(info => new EFEntityError(info, "Unauthorized Action", "Stratter is not the logged in user.", null));
                throw new EntityErrorsException(errors);
            }

            //Check that the stratter and the strattee are in the same group
            var stratterStratteeDiffGroups = spStratEntityInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpStratResponse;
                    Contract.Assert(responseEntity != null);

                    if (responseEntity.Assessor.GroupId != responseEntity.Assessee.GroupId)
                    {
                        return null;
                    }

                    return info;
                });

            spStratEntityInfos = spStratEntityInfos.Except(stratterStratteeDiffGroups).ToList();
            if (!spStratEntityInfos.Any())
            {
                var errors = stratterStratteeDiffGroups.ToList().Select(info => new EFEntityError(info, "Unauthorized Action", "Stratter and Strattee are in different groups.", null));
                throw new EntityErrorsException(errors);
            }

            //TODO: Check that the stratter doesn't have multiple strattees at the same position
            //the database checks this now, but still do it here?


            return spStratEntityInfos;
        }

        private List<EntityInfo> ProcessSpComment(List<EntityInfo> spCommentInfos, List<EcGroupMember> groupMembershipsList)
        {
            //Check for the commenter not being the logged in user
            var notLoggedInPerson = spCommentInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpComment;
                    Contract.Assert(responseEntity != null);

                    if (groupMembershipsList.Find(gm => gm.Id == responseEntity.AuthorId) != null)
                    {
                        return null;
                    }

                    return info;
                });

            spCommentInfos = spCommentInfos.Except(notLoggedInPerson).ToList();
            if (!spCommentInfos.Any())
            {
                var errors = notLoggedInPerson.Select(info => new EFEntityError(info, "Unauthorized Action", "Author is not the logged in user.", null));
                throw new EntityErrorsException(errors);
            }

            //Check that the commenter and the commentee are in the same group
            var commenterCommenteeDiffGroups = spCommentInfos
                .Select(info =>
                {
                    var responseEntity = info.Entity as SpComment;
                    Contract.Assert(responseEntity != null);

                    if (responseEntity.Author.GroupId != responseEntity.Recipient.GroupId)
                    {
                        return null;
                    }

                    return info;
                });

            spCommentInfos = spCommentInfos.Except(commenterCommenteeDiffGroups).ToList();
            if (!spCommentInfos.Any())
            {
                var errors = commenterCommenteeDiffGroups.ToList().Select(info => new EFEntityError(info, "Unauthorized Action", "Author and Recipient are in different groups.", null));
                throw new EntityErrorsException(errors);
            }

            //TODO: Check that the comment type is one of the allowed types
            //SpCommenttype Enum has them, field in db is a string

            return spCommentInfos;
        }
    }
}