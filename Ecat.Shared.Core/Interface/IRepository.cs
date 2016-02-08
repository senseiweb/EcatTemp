using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Core
{
    public interface IEntityRepository<T>
    {
        string GetMetadata<U>(): where U Data;
        IQueryable<T> All { get; }
        IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProps);
        T FindById(int id);
    }
}
