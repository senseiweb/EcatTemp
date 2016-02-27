﻿using System.Linq;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json.Linq;

namespace Ecat.StudMod.Core
{
    public interface IStudLogic
    {
        Person StudentPerson { get; set; }
        SaveResult ClientSave(JObject saveBundle);
        IQueryable<CrseStudentInGroup> GetInitalCourses();
        IQueryable<StudentInCourse> GetSingleCourse();
        IQueryable<CrseStudentInGroup> GetSingleWrkGrpMembers();

        string GetMetadata { get; }
    }
}
    