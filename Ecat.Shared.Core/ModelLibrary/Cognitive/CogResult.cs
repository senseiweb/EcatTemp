using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.Cognitive
{
    [TsClass(Module = "ecat.entity.s.cog")]
    public class CogResult
    {
        public int Id { get; set; }
        public string MpCogOutcome { get; set; }
        public float MpCogScore { get; set; }
    }
}
