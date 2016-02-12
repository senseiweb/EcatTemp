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
        public static Academy Keesler => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Keesler}", 
            LongName = "Mathies Noncommissioned Academy",
            ShortName = "KENCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Keesler,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Lackland => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Lackland}",
            LongName = "Gaylor Noncommissioned Academy",
            ShortName = "",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Lackland,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Peterson => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Peterson}",
            LongName = "Vosler Noncommissioned Academy",
            ShortName = "",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Peterson,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Sheppard => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Sheppard}",
            LongName = "Sheppard Noncommissioned Academy",
            ShortName = "SNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Sheppard,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Tyndall => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Lackland}",
            LongName = "Airey Noncommissioned Academy",
            ShortName = "AFSNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Lackland,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy McTy => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.McGheeTyson}",
            LongName = "Lankford Noncommissioned Academy",
            ShortName = "AFSNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.McGheeTyson,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Elmendorf => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Elmendorf}",
            LongName = " Noncommissioned Academy",
            ShortName = "ENCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Elmendorf,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Hickam => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Hickam}",
            LongName = " Noncommissioned Academy",
            ShortName = "HNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Hickam,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Kadena => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Kadena}",
            LongName = "Erwin Noncommissioned Academy",
            ShortName = "Kadena",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Kadena,
            EdLevel = EdLevel.Ncoa
        };

        public static Academy Kisling => new Academy
        {
            Id = $"{EdLevel.Ncoa}/{AcademyBase.Kisling}",
            LongName = "Kisling Noncommissioned Academy",
            ShortName = "AFSNCOA",
            BbCategoryId = "",
            ParentBbCategoryId = "",
            Base = AcademyBase.Kisling,
            EdLevel = EdLevel.Ncoa
        };
    }
}
