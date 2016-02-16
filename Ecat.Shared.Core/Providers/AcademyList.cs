using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Providers.Institution;
using Ecat.Shared.Model;

namespace Ecat.Shared.Core.Providers
{
    public static class GetAcademy
    {
        public static List<Academy> Academies;
         
        static GetAcademy()
        {
            var acList = typeof (AcademyRoster).GetProperties(BindingFlags.Static);
            Academies = new List<Academy>();

            foreach (var prop in acList)
            {
                var acad = prop.GetValue(null) as Academy; 
                if (acad != null)
                {
                    Academies.Add(acad);
                }
            }
        }

        public static Dictionary<AcademyBase, List<Academy>> BaseAcademyMap()
        {
            return Academies
                .GroupBy(acad => acad.Base)
                .ToDictionary(acad => acad.Key, acad => acad.ToList());
        }

        public static Dictionary<EdLevel, List<Academy>> EdLevelAcademyMap()
        {
            return Academies
                .GroupBy(acad => acad.EdLevel)
                .ToDictionary(acad => acad.Key, acad => acad.ToList());
        }
    }
}
