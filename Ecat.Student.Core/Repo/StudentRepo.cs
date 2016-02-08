using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Ecat.Student.Core.Interface;
using Ecat.Student.Data;
using Ecat.Student.Data.Context;
using Ecat.Student.Data.Interface;
using Ecat.Student.Data.Model;

namespace Ecat.Student.Core.Repo
{
    public class StudentRepo : IStudRepo
    {
        private readonly IStudRepo _repo;

        public StudentRepo(IStudRepo repo)
        {
            _repo = repo;
        }

        public IQueryable<SpAssessResponse> All { get; }

        public IQueryable<SpAssessResponse> AllIncluding(params Expression<Func<SpAssessResponse, object>>[] includeProps)
        {
            throw new NotImplementedException();
        }

        public SpAssessResponse FindById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
