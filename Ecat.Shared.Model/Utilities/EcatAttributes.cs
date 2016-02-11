using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecat.Shared.Model
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SaveGuardAttribute : Attribute
    {
        public GuardType[] Guardians { get; private set; }
        public SaveGuardAttribute(GuardType[] guardians)
        {
            Guardians = guardians;
        }
    }
}

