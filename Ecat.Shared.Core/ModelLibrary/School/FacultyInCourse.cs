using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.User;
using Newtonsoft.Json;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.School
{
    [TsClass(Module = "ecat.entity.s.school")]
    public class FacultyInCourse: ISoftDelete, ICompositeEntity
    {
        public string EntityId => $"{FacultyPersonId}, {CourseId}";
        public int CourseId { get; set; }
        public int FacultyPersonId  { get; set; }
        public Course Course { get; set; }
        public ProfileFaculty FacultyProfile { get; set; }

        public ICollection<FacSpResponse> SpResponses { get; set; }
        public ICollection<FacSpComment> SpComments { get; set; } 
        public ICollection<FacStratResponse> StratResponse { get; set; }
        public ICollection<SpComment> FlaggedComments { get; set; }

        [JsonIgnore][TsIgnore]
        public bool IsDeleted { get; set; }

        [JsonIgnore][TsIgnore]
        public int? DeletedById { get; set; }

        [JsonIgnore][TsIgnore]
        public DateTime? DeletedDate { get; set; }
    }
}
