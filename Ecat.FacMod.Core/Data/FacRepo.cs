﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.DbMgr.Context;
using Newtonsoft.Json.Linq;

namespace Ecat.FacMod.Core
{
    using Guard = Func<Dictionary<Type, List<EntityInfo>>, Dictionary<Type, List<EntityInfo>>>;

    public class FacRepo : IFacRepo
    {
        private readonly EcatContext _ctx;
        private readonly EFContextProvider<FacCtx> _efCtx;

        public FacRepo(EcatContext ctx, EFContextProvider<FacCtx> efCtx)
        {
            _ctx = ctx;
            _efCtx = efCtx;
        }

        SaveResult IFacRepo.ClientSaveChanges(JObject saveBundle, List<Guard> saveGuards)
        {
            if (!saveGuards.Any()) return _efCtx.SaveChanges(saveBundle);

            foreach (var saveGuard in saveGuards)
            {
                _efCtx.BeforeSaveEntitiesDelegate += saveGuard;
            }

            return _efCtx.SaveChanges(saveBundle);
        }


        string IFacRepo.Metadata => _efCtx.Metadata();

        IQueryable<FacultyInCourse> IFacRepo.GetFacultyCourses => _ctx.FacultyInCourses
            .Where(fc => !fc.IsDeleted)
            .OrderByDescending(fc => fc.Course.StartDate)
            .Include(fc => fc.Course);

        void IFacRepo.AddCourseWorkgroups(Course course)
        {
            _ctx.Entry(course).Collection(wg => wg.WorkGroups).Load();
        }

        IQueryable<CommentCount> IFacRepo.AuthorCommentCounts(List<int> authorIds, int workGroupId)
        {
            return _ctx.StudentInGroups
                .Where(sig => authorIds.Contains(sig.StudentId) && sig.WorkGroupId == workGroupId)
                .Select(sig => new CommentCount
                {
                    AuthorId = sig.StudentId,
                    NumOfComments = sig.AuthorOfComments.Count()
                });
        }

        IQueryable<WorkGroup> IFacRepo.GetCourseWorkGroups => _ctx.WorkGroups;

        IQueryable<CrseStudentInGroup> IFacRepo.GetWorkGroupMembers => _ctx.StudentInGroups.Where(sig => !sig.IsDeleted);
    }

}
