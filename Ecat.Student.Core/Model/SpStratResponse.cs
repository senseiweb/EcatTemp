using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core;
using Ecat.Student.Core.Model.RefOnly;

namespace Ecat.Student.Core.Model
{
    public class SpStratResponse : IAuditable
    {
        public int Id { get; set; }
        public int AssessorId { get; set; }
        public int AssesseeId { get; set; }
        public int StratPosition { get; set; }
        public int? StratResultId { get; set; }

        public StudInGroup Assessor { get; set; }
        public StudInGroup Assessee { get; set; }
        public SpStratResult StratResult { get; set; }

        public int? ModifiedById { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
