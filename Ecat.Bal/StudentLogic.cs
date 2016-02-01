using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Dal;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.Context;
using Ecat.Models;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using Newtonsoft.Json.Linq;

namespace Ecat.Bal
{
    public class StudentLogic : IStudentLogic
    {
        private readonly ICommonRepo _commonRepo;
        private readonly IStudentRepo _studentRepo;

        public EcPerson User { get; set; }

        public StudentLogic(ICommonRepo commonRepo, IStudentRepo studentRepo)
        {
            _commonRepo = commonRepo;
            _studentRepo = studentRepo;
        }

        public async Task<EcCourseMember[]> GetMembershipsAndAssessments()
        {
            EcCourseMember[] courseMemberships = await _studentRepo.GetCourses
                .Where(cm => cm.PersonId == User.PersonId && cm.MpCourseRole == EcRoles.Student.ToString())
                .OrderByDescending(cm => cm.Course.StartDate)
                .ToArrayAsync();

            EcCourseMember currentCourse = courseMemberships.First();

            currentCourse.Groups = await _studentRepo.GetGroupsAndAssessments.Where(gm => gm.Member.Id == courseMemberships.First().Id).ToArrayAsync();

            return courseMemberships;
        }

        //public async Task<SpInstrument> GetInstrument(int groupId)
        //{
        //    SpInstrument instrument = await _studentRepo.GetInstrument.Where(i => i.AssignedGroups)
        //}
    }
}
