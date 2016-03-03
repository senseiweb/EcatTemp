﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Interface;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.Designer;
using Ecat.Shared.Core.ModelLibrary.Faculty;
using Ecat.Shared.Core.ModelLibrary.Learner;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.School
{
    [TsClass(Module = "ecat.entity.s.school")]
    public class WorkGroup 
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string MpCategory { get; set; }
        public string GroupNumber { get; set; }

        public int? AssignedSpInstrId { get; set; }
        public int? AssignedKcInstrId { get; set; }
       
        public string CustomName { get; set; }
        public string BbGroupId { get; set; }
        public string DefaultName { get; set; }
        public float MaxStrat { get; set; }
        public string MpSpStatus { get; set; }
        public bool IsPrimary { get; set; }

        public Course Course { get; set; }

        public ICollection<FacSpResponse> FacSpResponses { get; set; }
        public ICollection<FacStratResponse> FacStratResponses { get; set; }
        public ICollection<FacSpComment> FacSpComments { get; set; }

        public ICollection<CrseStudentInGroup> GroupMembers { get; set; }

        public ICollection<SpComment> SpComments { get; set; }
        public ICollection<SpResponse> SpResponses { get; set; }
        public ICollection<SpResult> SpResults { get; set; }
        public ICollection<StratResponse> SpStratResponses { get; set; }
        public ICollection<StratResult> SpStratResults { get; set; }

        public SpInstrument AssignedSpInstr { get; set; }
        public KcInstrument AssignedKcInstr { get; set; }
        public bool CanPublish { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
