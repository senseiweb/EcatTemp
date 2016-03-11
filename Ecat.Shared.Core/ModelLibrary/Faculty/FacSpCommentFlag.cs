﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Common;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Faculty
{
    [TsClass(Module = "ecat.entity.s.faculty")]
    public class FacSpCommentFlag 
    {
        public string MpFaculty { get; set; }
        public int FlaggedByFacultyId { get; set; }
        public string MpAuthor { get; set; }
        public string MpRecipient { get; set; }
        public int RecipientPersonId { get; set; }
        public int CourseId { get; set; }
        public int WorkGroupId { get; set; }
        public FacSpComment Comment { get; set; }
    }
}
