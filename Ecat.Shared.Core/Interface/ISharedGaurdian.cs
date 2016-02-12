using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core
{
    public interface ISharedGuardian
    {
        List<EntityInfo> DeleteGuardian(ref List<EntityInfo> deletedInfos, Person loggedInPerson);
        List<EntityInfo> AuditableGuardian(ref List<EntityInfo> auditableInfos, Person loggedInPerson);
        List<EntityInfo> ModifiedGuardian(ref List<EntityInfo> modifiedInfos, Person loggedInPerson);
    }
}
