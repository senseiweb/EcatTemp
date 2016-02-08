using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Diagnostics.Contracts;
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

    public class UserSaveguard
    {
        private readonly EcatCtx _serverCtx;
        private readonly EcPerson _loggedInPerson;
        private SaveMap _saveMapRef;
        private static readonly Dictionary<string, List<UserRoleType>> _userSgAttr;
        
        static UserSaveguard()
        {
            _userSgAttr = new Dictionary<string, List<UserRoleType>>();

            var properties = typeof(EcPerson).GetProperties();

            foreach (var propertyInfo in properties)
            {
                var attrs = propertyInfo.GetCustomAttributes(true);

                foreach (var attr in attrs)
                {
                    var userSgAttribute = attr as UserSgAttribute;

                    if (userSgAttribute == null) continue;

                    var propName = userSgAttribute.Name;
                    var allowTypes = userSgAttribute.Allowed.ToList();

                    _userSgAttr.Add(propName, allowTypes);
                }
            }
        }

        public UserSaveguard(EcatCtx serverCtx, EcPerson person)
        {
            _serverCtx = serverCtx;
            _loggedInPerson = (person.PersonId == 0) ? null : person;
         

        }

        public SaveMap BeforeSaveEntities(SaveMap saveMap)
        {
            _saveMapRef = saveMap;

            //Remove any unauthorized entities
            foreach (var nonUserEntity in saveMap.Where(entry => entry.Key != typeof(EcPerson) &&
                                                        entry.Key != typeof(EcFacilitator) &&
                                                        entry.Key != typeof(EcUserNotify) &&
                                                        entry.Key != typeof(EcExternal) &&
                                                        entry.Key != typeof(EcSecurity) &&
                                                        entry.Key != typeof(EcStudent)).ToList())
            {
                saveMap.Remove(nonUserEntity.Key);
            }

            //Throw error if nothing left after removal
            if (!saveMap.Any())
            {
                var infos = saveMap.Values.SelectMany(infoList => infoList).ToList();

                var errors = infos.Select(info => new EFEntityError(info, "Unauthorized Action", "These datatypes are not allowed to processed on this endpoint!", null));
                throw new EntityErrorsException(errors);
            }

            //Disallow any deletions
            var infoMarkedForDeletion = saveMap.Values.SelectMany(infoList => infoList).Where(infoList => infoList.EntityState == EntityState.Deleted || infoList.EntityState == EntityState.Detached).ToList();

            if (infoMarkedForDeletion.Any() && _loggedInPerson?.MpInstituteRole != EcMapInstituteRole.HqAdmin)
            {
                var errors = infoMarkedForDeletion.Select(info => new EFEntityError(info, "Unauthorized Action", "Deletion are not allowed!", null));
                throw new EntityErrorsException(errors);
            }

            //Process Person Type Entities
            var personEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof(EcPerson)).Key;

            if (personEntityKey != null)
            {
                if (_loggedInPerson?.MpInstituteRole != EcMapInstituteRole.HqAdmin)
                {
                    saveMap[personEntityKey] = _loggedInPerson == null ? ProcessAsExternalUser(saveMap[personEntityKey]) : ProcessAsAuthenticatedUser(saveMap[personEntityKey]);
                }
            }

            //Process Profile Type Entities
           var profileEntity = saveMap.SingleOrDefault(map => typeof(IPersonProfile).IsAssignableFrom(map.Key)).Key;

            if (profileEntity != null)
            {
                saveMap[profileEntity] = ProcessProfiles(saveMap[profileEntity]);
            }

            //Process Profile Type Entities
            var securityEntityKey = saveMap.SingleOrDefault(map => map.Key == typeof (EcSecurity)).Key;

            if (securityEntityKey != null)
            {
                saveMap[securityEntityKey] = ProcessSecurity(saveMap[securityEntityKey]);
            }

            foreach (var auditableEntity in saveMap.Where(map => typeof(IAuditable).IsAssignableFrom(map.Key)).SelectMany(auditableItem => auditableItem.Value.Select(entityInfo => entityInfo.Entity).OfType<IAuditable>()))
            {
                auditableEntity.ModifiedById = _loggedInPerson?.ModifiedById;
                auditableEntity.ModifiedDate = DateTime.Now;
            }

            return saveMap;
        }

        private List<EntityInfo> ProcessAsAuthenticatedUser(List<EntityInfo> personEntityInfos)
        {
            var personEntityInfo = personEntityInfos.Single();
            var personEntity = personEntityInfo.Entity as EcPerson;

            if (personEntity?.PersonId != _loggedInPerson.PersonId)
            {
                var errors = personEntityInfos.Select(info => new EFEntityError(info, "Ownership Error", "Could relate entities to you, changes to other individual records are not allowed!", "PersonId"));
                throw new EntityErrorsException(errors);
            }

            var isBbControlled = _loggedInPerson.MpInstituteRole != EcMapInstituteRole.External;

            //Remove keys that are not allowed to be changed by user role
            if (isBbControlled)
            {
                var disAllowedChanges =
                    _userSgAttr.Where(attr => !attr.Value.Contains(UserRoleType.BbDefined))
                        .Select(attr => attr.Key);

                foreach (
                    var originalValue in
                        personEntityInfo.OriginalValuesMap.Where(value => disAllowedChanges.Contains(value.Key)).ToList())
                {
                    personEntityInfo.OriginalValuesMap.Remove(originalValue.Key);
                }
            }
            else
            {
                var disAllowedChanges =
                    _userSgAttr.Where(attr => !attr.Value.Contains(UserRoleType.External))
                        .Select(attr => attr.Key);

                foreach (
                    var originalValue in
                        personEntityInfo.OriginalValuesMap.Where(value => disAllowedChanges.Contains(value.Key)).ToList())
                {
                    personEntityInfo.OriginalValuesMap.Remove(originalValue.Key);
                }
            }

            return personEntityInfos;
        }

        private List<EntityInfo> ProcessAsExternalUser(List<EntityInfo> personEntityInfos)
        {
            var entityInfo = personEntityInfos.Single();
            var self = entityInfo.Entity as EcPerson;

            var existingUser = _serverCtx.People.Count(user => user.Email == self.Email);

            if (existingUser > 0)
            {
                var errors = personEntityInfos.Select(info => new EFEntityError(info, "Duplication Error", "There is already an account associated with this email", "Email Address"));
                throw new EntityErrorsException(errors);
            }

            if (entityInfo.EntityState != EntityState.Added)
            {
                var errors = personEntityInfos.Select(info => new EFEntityError(info, "Unauthorized Action", "Only account creation can be added by anonymous individuals", null));
                throw new EntityErrorsException(errors);
            }

            Debug.Assert(self != null);

            self.BbUserId = null;
            self.BbUserName = null;
            self.IsRegistrationComplete = false;
            self.MpInstituteRole = EcMapInstituteRole.External;
            return personEntityInfos;
        }

        private List<EntityInfo> ProcessSecurity(List<EntityInfo> securityEntityInfos)
        {

            if (securityEntityInfos.Count > 1)
            {
                var errors = securityEntityInfos.Select(info => new EFEntityError(info, "Duplicity Error", "Multiple security update are not allowed", null));
                throw new EntityErrorsException(errors);
            }

            var securityInfo = securityEntityInfos.Single();

            var securityRecord = securityInfo.Entity as EcSecurity;

            Debug.Assert(securityRecord != null);

            if (_loggedInPerson == null)
            {
                if (securityInfo.EntityState != EntityState.Added)
                {
                    var errors =
                        securityEntityInfos.Select(info => new EFEntityError(info, "Unauthorized Action",
                            "Anonymous users are allowed to perform the requested action.", null));
                    throw new EntityErrorsException(errors);
                }

                securityRecord.PasswordHash = PasswordHash.CreateHash(securityRecord.TempPassword);
                securityRecord.TempPassword = null;
                return securityEntityInfos;
            }


            if ( _loggedInPerson.MpInstituteRole != EcMapInstituteRole.HqAdmin &&  securityRecord.PersonId != _loggedInPerson?.PersonId){
                var errors = securityEntityInfos.Select(info => new EFEntityError(info, "Unauthorized Action", "Anonymous users are allowed to perform the requested action.", null));
                throw new EntityErrorsException(errors);
            }

            if (securityRecord.TempPassword == null)
            {
                return securityEntityInfos;
            }

            securityRecord.PasswordHash = PasswordHash.CreateHash(securityRecord.TempPassword);
            securityRecord.TempPassword = null;
            securityInfo.OriginalValuesMap.Add("PasswordHash", null);
            return securityEntityInfos;
        }

        private List<EntityInfo> ProcessProfiles(List<EntityInfo> profileEntityInfos)
        {
            if (_loggedInPerson == null)
            {
                if (profileEntityInfos.Count() > 1 ||
                    profileEntityInfos.Any(info => info.EntityState != EntityState.Added))
                {
                    var errors = profileEntityInfos.Select(info => new EFEntityError(info, "Unauthorized Request",
                        "Cannot update profile information for anonymous user!", null));
                    throw new EntityErrorsException(errors);
                }

                var newProfile = profileEntityInfos.Single().Entity as IPersonProfile;
                var newUser = _saveMapRef[typeof (EcPerson)].Single().Entity as EcPerson;
                newProfile.PersonId = newUser.PersonId;
                return profileEntityInfos;
            }

            if (_loggedInPerson.MpInstituteRole == EcMapInstituteRole.HqAdmin)
            {
                foreach (var info in profileEntityInfos)
                {
                    var profileEntity = info.Entity as IPersonProfile;
                    var vc = new ValidationContext(info.Entity);

                    if (profileEntity?.PersonId == _loggedInPerson.PersonId)
                    {
                        _loggedInPerson.IsRegistrationComplete = Validator.TryValidateObject(info.Entity, vc, null, true);
                    }
                    else
                    {
                        var user = _serverCtx.People.Find(profileEntity.PersonId);
                        user.IsRegistrationComplete = Validator.TryValidateObject(info.Entity, vc, null, true);
                    }
                }

            }
            else
            {
                var profileEntity = profileEntityInfos.Single().Entity as IPersonProfile;

                if (profileEntity?.PersonId != _loggedInPerson.PersonId)
                {
                    var errors =
                        profileEntityInfos.Select(
                            info =>
                                new EFEntityError(info, "Unauthorized Changes",
                                    "Cannot update profiles that do not belong to you!", null));
                    throw new EntityErrorsException(errors);
                }

                if (_loggedInPerson.IsRegistrationComplete) return profileEntityInfos;

                var vc = new ValidationContext(profileEntity);

                if (!Validator.TryValidateObject(profileEntity, vc, null, true))
                {
                    var errors =
                        profileEntityInfos.Select(
                            info =>
                                new EFEntityError(info, "Validation Errors", "Cannot validate profile information!",
                                    null));
                    throw new EntityErrorsException(errors);
                }

                var infoForPersonInMap =
                    _saveMapRef.Where(map => map.Key == typeof (EcPerson))
                        .SelectMany(map => map.Value)
                        .Select(info => info)
                        .SingleOrDefault(info =>
                        {
                            var entity = info.Entity as EcPerson;
                            return entity?.PersonId == _loggedInPerson.PersonId;
                        });


                if (infoForPersonInMap != null)
                {
                    var personEntity = infoForPersonInMap.Entity as EcPerson;
                    Contract.Assert(personEntity != null);
                    personEntity.IsRegistrationComplete = true;

                    if (infoForPersonInMap.OriginalValuesMap == null)
                    {
                        infoForPersonInMap.OriginalValuesMap = new Dictionary<string, object>();
                    }

                    infoForPersonInMap.OriginalValuesMap.Add("IsRegistrationComplete", null);
                }
                else
                {
                    var ctxProvider = new EFContextProvider<EcatCtx>();
                    var newPersonInfo = ctxProvider.CreateEntityInfo(_loggedInPerson, EntityState.Modified);
                    var newPerson = newPersonInfo.Entity as EcPerson;

                    Contract.Assert(newPerson != null);

                    newPerson.IsRegistrationComplete = true;
                    newPersonInfo.OriginalValuesMap = new Dictionary<string, object>
                    {
                        {"IsRegistrationComplete", null}
                    };

                    List<EntityInfo> existingPersonInfo;

                    if (!_saveMapRef.TryGetValue(typeof (EcPerson), out existingPersonInfo))
                    {
                        existingPersonInfo = new List<EntityInfo>();
                        _saveMapRef.Add(typeof (EcPerson), existingPersonInfo);
                    }

                    existingPersonInfo.Add(newPersonInfo);
                }

            }

            return profileEntityInfos;
        }

    }
}

