using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.Utility;

namespace Ecat.Shared.Core.Logic
{
    public static class StaticAcademy
    {
       
        public static Dictionary<string, Academy> AcadLookup => new Dictionary<string, Academy>
        {
            {Afsncoa.Id, Afsncoa}
        }; 

        public static Academy Afsncoa
         => new Academy
         {
             Id = "AFSNCOA",
             LongName = "Air Force Senior Noncommissioned Academy",
             ShortName = "AFSNCOA",
             EdLevel = EdLevel.Senior,
             Base = AcademyBase.Gunter,
             BbCategoryId = MpAcadCat.AFSNCOA,
             ParentBbCategoryId = MpAcadCat.AFSNCOA
         };


        public static Academy Keesler
        => new Academy
        {
            Id = "KNCOA",
            LongName = "Keesler Noncommissioned Officer Academy",
            ShortName = "Mathies NCOA",
            EdLevel = EdLevel.Senior,
            Base = AcademyBase.Gunter,
            BbCategoryId = MpAcadCat.NCOA,
            ParentBbCategoryId = MpAcadCat.KNCOA
        };
    }
}
