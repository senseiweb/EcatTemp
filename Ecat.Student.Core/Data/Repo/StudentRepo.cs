using System;
using System.Linq;
using System.Linq.Expressions;
using Ecat.Shared.Model;
using Ecat.Student.Core.Interface;

namespace Ecat.Student.Core.Data
{
    public class StudentRepo : IStudRepo
    {
        private readonly IStudRepo _repo;

        public StudentRepo(IStudRepo repo)
        {
            _repo = repo;
        }

        public string GetMetadata<TContext>() where TContext : new()
        {
            throw new NotImplementedException();
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
