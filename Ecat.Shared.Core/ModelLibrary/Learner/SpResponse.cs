﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.Utility.Validation;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Learner
{
    [TsClass(Module = "ecat.entity.s.learner")]
    [StudSpReponseValid]
    public class SpResponse : ICompositeEntity, IWorkGroupMonitored, ICourseMonitored
    {
        public string EntityId => $"{AssessorPersonId}|{AssesseePersonId}|{CourseId}|{WorkGroupId}|{InventoryItemId}";

        public int AssessorPersonId { get; set; }
        public int AssesseePersonId { get; set; }
        public int WorkGroupId { get; set; }
        public int CourseId { get; set; }
        public int InventoryItemId { get; set; }

        public string MpItemResponse { get; set; }
        public int ItemModelScore { get; set; }

        public SpInventory InventoryItem { get; set; }
        public WorkGroup WorkGroup { get; set; }
        public Course Course { get; set; }
        public CrseStudentInGroup Assessor { get; set; }
        public CrseStudentInGroup Assessee { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
