using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Common;
using Ecat.Shared.Core.ModelLibrary.School;
using Ecat.Shared.Core.Utility;

namespace Ecat.Shared.Core.Logic
{
    public static class StaticAcademy
    {

        public static Dictionary<string, Academy> AcadLookupById => new Dictionary<string, Academy>
        {
            {Afsncoa.Id, Afsncoa},
            {Keesler.Id, Keesler },
            {Ecat.Id, Ecat}
        };

        public static Dictionary<string, Academy> AcadLookupByCat => new Dictionary<string, Academy>
        {
            {Afsncoa.BbCategoryId, Afsncoa},
            {Keesler.BbCategoryId, Keesler },
            {Ecat.BbCategoryId, Ecat }
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
             ParentBbCategoryId = MpAcadCat.BCEE
         };

        public static Academy Ecat
       => new Academy
       {
           Id = "ECAT",
           LongName = "ECAT Developer Academy",
           ShortName = "ECAT",
           EdLevel = EdLevel.None,
           Base = AcademyBase.Gunter,
           BbCategoryId = MpAcadCat.ECAT,
           ParentBbCategoryId = MpAcadCat.BCEE
       };

        public static Academy Keesler
        => new Academy
        {
            Id = "KNCOA",
            LongName = "Keesler Noncommissioned Officer Academy",
            ShortName = "Mathies NCOA",
            EdLevel = EdLevel.Ncoa,
            Base = AcademyBase.Gunter,
            BbCategoryId = MpAcadCat.Keesler,
            ParentBbCategoryId = MpAcadCat.NCOA
        };
    }
}
