using System;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.BbWs.Course;
using Ecat.Dal.Context;

namespace Ecat.Dal
{
    public class CommonRepo : ICommonRepo
    {
        private readonly EcatCtx _serverCtx;
        private readonly IBbWrapper _ws;

        public async Task<CategoryVO[]> GetCategoryList()
        {
            // 0 = GET_ALL_COURSE_CATEGORY, 1 = GET_ALL_ORG_CATEGORY, 2 = GET_CATEGORY_BY_ID, 3= GET_CATEGORY_BY_PARENT_ID
            var client = await _ws.GetCourseClient();
            var cf = new CategoryFilter
            {

                filterTypeSpecified = true,
                filterType = 0,
            };

            var result = await client.getCategoriesAsync(cf);

            var categoryList = result.@return;
            if (categoryList.Length == 0)
            {
                return categoryList;
            }

            var parentCategory =
               categoryList.FirstOrDefault(
                    cat => string.Equals(cat.title, "bcee", StringComparison.InvariantCultureIgnoreCase));

            return (parentCategory != null) ? categoryList.Where(cat => cat.parentId == parentCategory.id).ToArray() : categoryList;
        }

        public string GetMetadata<T>() where T : EcatCtx, new()
        {
            var contextProvider = new EFContextProvider<T>();
            return contextProvider.Metadata();
        }

        public CommonRepo(EcatCtx serverCtx, IBbWrapper ws)
        {
            _serverCtx = serverCtx;
            _ws = ws;
        }
    }
}
