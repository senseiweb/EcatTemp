using System;
using System.Collections.Generic;
using Ecat.Shared.Core;
using Newtonsoft.Json;

namespace Ecat.Shared.Model
{
    public class MemberInCourse : ISoftDelete
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int PersonId { get; set; }
        public string MpCourseRole { get; set; }

        public Course Course { get; set; }
        public Person Person { get; set; }
        public ICollection<MemberInGroup> StudGroupEnrollments { get; set; }

        [JsonIgnore]
        public bool IsDeleted { get; set; }

        [JsonIgnore]
        public int? DeletedById { get; set; }

        [JsonIgnore]
        public DateTime? DeletedDate { get; set; }
    }
}