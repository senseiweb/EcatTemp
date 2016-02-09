using System.Data.Entity;
using Ecat.Shared.Data.Model;

namespace Ecat.Student.Data.Interface
{
    public interface IStudOpsContext
    {
        IDbSet<SpAssessResponse> SpAssessResponses { get; set; }
        IDbSet<SpAssessResult> SpAssessResults { get; set; }
        IDbSet<SpComment> SpComments { get; set; }
        IDbSet<SpStratResponse> SpStratResponses { get; set; }
        IDbSet<SpStratResult> SpStratResults { get; set; } 
    }
}
