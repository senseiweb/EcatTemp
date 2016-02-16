using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core.Providers.Institution
{
    public static partial class AcademyRoster
    {
        public static Academy Cmsa => new Academy
        {
            Id = $"{EdLevel.Chief}/{AcademyBase.Gunter}",
            LongName = "AF Chief Leadership Academy",
            ShortName = "CMSA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Gunter,
            EdLevel = EdLevel.Chief
        };

        public static Academy Afsncoa => new Academy
        {
            Id = $"{EdLevel.Senior}/{AcademyBase.Gunter}",
            LongName = "AF Senior Noncommissioned Officer Academy",
            ShortName = "AFSNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Gunter,
            EdLevel = EdLevel.Senior
        };

        public static Academy Epmeic => new Academy
        {
            Id = $"{EdLevel.Instructor}/{AcademyBase.Gunter}",
            LongName = "Enlisted Professional Military Education Instructor Course",
            ShortName = "EPMEIC",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Gunter,
            EdLevel = EdLevel.Instructor
        };

        public static Academy Shirt => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Gunter}",
            LongName = "First Sergeant Academy",
            ShortName = "FSA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Gunter,
            EdLevel = EdLevel.Ncoa
        };
    }
}
