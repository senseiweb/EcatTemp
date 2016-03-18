using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.DbMgr.Context;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    
    public class StudRepo : IStudRepo
    {
        private readonly StudCtx _ctx;
        private readonly EcatContext _mainCtx;
        private readonly EFContextProvider<StudCtx> _efCtx;

        public StudRepo(EFContextProvider<StudCtx> efCtx, StudCtx ctx, EcatContext mainContext)
        {
            _efCtx = efCtx;
            _ctx = ctx;
            _mainCtx = mainContext;
        }

        public SaveResult ClientSaveChanges(JObject saveBundle)
        { 

            return _efCtx.SaveChanges(saveBundle);
        }

        public string GetMetadata => _efCtx.Metadata();

        public CrseStudentInGroup FindStudInGrpById(int studentId, int courseId, int workGroupId)
        {
            return _ctx.StudentInGroups.Find(studentId, courseId, workGroupId);
        }

        IQueryable<SpResult> IStudRepo.SpResult => _mainCtx.SpResults;

        IQueryable<WorkGroup> IStudRepo.WorkGroups(bool addInstrument)
        {
            var query = _ctx.WorkGroups;

            return addInstrument
                ? query.Include(wg => wg.AssignedSpInstr)
                    .Include(wg => wg.AssignedSpInstr.InventoryCollection)
                : query;
        }

        void IStudRepo.LoadGroupPeers(CrseStudentInGroup groupMember)
        {
             _ctx.Entry(groupMember)
                .Collection(gm => gm.WorkGroup.GroupMembers)
                .Query()
                .Where(gm => !gm.IsDeleted)
                .Load();
        }

        IQueryable<SpInventory> IStudRepo.Inventories => _ctx.Inventories
            .Where(inv => inv.IsDisplayed)
            .Include(inv => inv.Instrument);

        async Task<FacResultForStudent> IStudRepo.GetFacSpResult(int studId, int wgId)
        {
            using (var mainCtx = new EcatContext())
            {
                var responses = await mainCtx.WorkGroups
                    .Where(wg => wg.Id == wgId)
                    .Select(wg => new FacResultForStudent
                    {
                        FacSpCommentFlag = wg.FacSpComments
                            .Where(comment => comment.RecipientPersonId == studId)
                            .Select(comment => comment.Flag).ToList(),
                        FacSpComments = wg.FacSpComments
                            .Where(comment => comment.RecipientPersonId == studId).ToList(),
                        FacResponses = wg.FacSpResponses
                            .Where(response => !response.IsDeleted &&
                                               response.AssesseePersonId == studId).ToList()
                    }).SingleOrDefaultAsync();
                return responses;
            }
        }

        public IQueryable<CrseStudentInGroup> CrseStudentInGroups => _ctx.StudentInGroups
            .Where(sg => !sg.IsDeleted)
            .Include(gm => gm.WorkGroup);

        public IQueryable<StudentInCourse> Courses => _ctx.StudentInCourses
            .Where(course => !course.IsDeleted);
    }
}
