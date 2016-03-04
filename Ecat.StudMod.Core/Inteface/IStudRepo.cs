using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public interface IStudRepo
    {
        string GetMetadata { get; }
        SaveResult ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards);
        IQueryable<CrseStudentInGroup> CrseStudentInGroups { get; }
        IQueryable<StudentInCourse> Courses { get; }
    }
}
