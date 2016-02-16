﻿using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core.Logic
{
    public class SharedGuardian : ISharedGuardian
    {
        public void DeleteGuardian(ref List<EntityInfo> deleteInfos, Person loggedInPerson)
        {
            if (loggedInPerson == null)
            {
                var errors = deleteInfos.Select(info => new EFEntityError(info, "Unauthorized Action", "Anonymous users are not allowed to delete!", null));
                throw new EntityErrorsException(errors);
            }

            var itemsToRemove = new List<EntityInfo>();

            foreach (var info in deleteInfos)
            {
                var softDeletable = info.Entity as ISoftDelete;
                if (softDeletable == null)
                {
                    itemsToRemove.Add(info);
                    continue;
                }
                softDeletable.DeletedById = loggedInPerson.PersonId;
                softDeletable.IsDeleted = true;
                softDeletable.DeletedDate = DateTime.Now;
            }

            if (!itemsToRemove.Any()) return;

            foreach (var rmInfo in itemsToRemove)
            {
                deleteInfos.Remove(rmInfo);
            }
        }

        public List<EntityInfo> AuditableGuardian(ref List<EntityInfo> auditableInfos, Person loggedInPerson)
        {
            throw new NotImplementedException();
        }

        public List<EntityInfo> ModifiedGuardian(ref List<EntityInfo> modifiedInfos, Person loggedInPerson)
        {
            throw new NotImplementedException();
        }
    }
}
