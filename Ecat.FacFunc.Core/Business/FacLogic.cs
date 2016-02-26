using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.FacFunc.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Ecat.Shared.Core.Utility;
using Newtonsoft.Json.Linq;

namespace Ecat.FacFunc.Core.Business
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public class FacLogic : IFacLogic
    {
        private readonly IFacRepo _repo;
        public Person FacultyPerson { get; set; }

        public FacLogic(IFacRepo repo)
        {
            _repo = repo;
        }

        public SaveResult ClientSave(JObject saveBundle)
        {
            var neededSaveGuards = new List<Guard>();

            if (FacultyPerson.MpInstituteRole != MpInstituteRoleName.HqAdmin)
            {
                //var userGuard = new GuardUserSave(User);
                //neededSaveGuards.Add(userGuard.BeforeSaveEntities);
            }

            return _repo.ClientSaveChanges(saveBundle, neededSaveGuards);
        }

        public string GetMetadata => _repo.Metadata;

        public IQueryable<FacultyInCourse> GetCrsesWithLastestGrpMem()
        {
            return _repo.GetFacultyCourses
                .Where(fc => fc.FacultyPersonId == 128)
                .Include(crse => crse.Course.WorkGroups);
        }

        public IQueryable<CrseStudentInGroup> GetMembersByCrseId()
        {
            return _repo.GetAllWorkGroupData
                .Where(g => g.WorkGroup.Course.Faculty
                    .Any(fac => fac.FacultyPersonId == FacultyPerson.PersonId));
        }
    }
}
