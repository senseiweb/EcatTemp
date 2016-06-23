using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Common
{
    [TsClass(Module = "ecat.entity.s.lmsAdmin")]
    public class SaveGradeResult 
    {
        public int CourseId { get; set; }
        public string WGCategory { get; set; }
        public bool Success { get; set; }
        public int StudScores { get; set; }
        public int FacScores { get; set; }
        public string Message { get; set; }
    }
}
