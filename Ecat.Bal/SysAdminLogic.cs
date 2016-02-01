using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Dal;
using Ecat.Models;
using Newtonsoft.Json.Linq;

namespace Ecat.Bal
{
    public class SysAdminLogic : ISysAdminLogic
    {
        private readonly ICourseRepo _courseRepo;
        private readonly ISysAdminRepo _saRepo;

        public EcPerson User { get; set; }

        public SysAdminLogic(ICourseRepo courseRepo, ISysAdminRepo saRepo)
        {
            _courseRepo = courseRepo;
            _saRepo = saRepo;
        }

        public IQueryable<EcAcademy> GetAcademies()
        {
            return _saRepo.GetAcademies();
        }

        public async Task<List<AcademyCategory>> GetAcademyCategory()
        {
            var categoryList = await _courseRepo.GetCategoryList();

            if (categoryList.Length == 0)
            {
                return null;
            }

            return categoryList.Select(cat => new AcademyCategory
            {
                Id = cat.id,
                BbCatId = cat.id,
                BbCatName = cat.title
            }).ToList();
        }

        public SaveResult BzSave(JObject saveBundle)
        {
            return _saRepo.BzSave(saveBundle, User);
        }
    }
}
