using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeLite;

namespace Ecat.Shared.Core.ModelLibrary.User
{
    [TsClass(Module = "ecat.entity.s.user")]
    public abstract class ProfileBase
    {
        public int PersonId { get; set; }
        public string Bio { get; set; }
        public string  HomeStation { get; set; }
        public Person Person { get; set; }
    }
}
