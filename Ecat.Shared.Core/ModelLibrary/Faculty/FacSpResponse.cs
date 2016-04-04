﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Learner;
using Ecat.Shared.Core.ModelLibrary.School;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Faculty
{
    [TsClass(Module = "ecat.entity.s.faculty")]
    public class FacSpResponse : IAuditable, IWorkGroupMonitored, ICourseMonitored
    {
        public string EntityId => $"{AssesseePersonId}|{CourseId}|{WorkGroupId}|{InventoryItemId}";
        public int InventoryItemId { get; set; }

        public int WorkGroupId { get; set; }
        public int FacultyPersonId { get; set; }
        public int AssesseePersonId { get; set; }
        public int CourseId { get; set; }

        public string MpItemResponse { get; set; }
        public float ItemModelScore { get; set; }
        //public int ScoreModelVersion { get; set; }

        public WorkGroup WorkGroup { get; set; }
        public CrseStudentInGroup Assessee { get; set; }
        public FacultyInCourse FacultyAssessor { get; set; }
        public SpInventory InventoryItem { get; set; }

        [TsIgnore]
        public bool IsDeleted { get; set; }
        [TsIgnore]
        public int? DeletedById { get; set; }
        [TsIgnore]
        public DateTime? DeletedDate { get; set; }
        [TsIgnore]
        public int? ModifiedById { get; set; }
        [TsIgnore]
        public DateTime? ModifiedDate { get; set; }
    }
}
