using System;
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
        public List<EntityInfo> DeleteGuardian(ref List<EntityInfo> deleteInfos, Person loggedInPerson)
        {
            if (loggedInPerson == null)
            {
                var errors = deleteInfos.Select(info => new EFEntityError(info, "Unauthorized Action", "Anonymous users are not allowed to delete!", null));
                throw new EntityErrorsException(errors);
            }
            return deleteInfos.ToList();
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
