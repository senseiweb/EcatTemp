using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;

namespace Ecat.Models
{
    [AttributeUsage(AttributeTargets.Class)]
    public class PersonMappedPropValid : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext vc)
        {
            var person = value as EcPerson;
            if (person == null)
            {
                ErrorMessage = "Attribute allow only on a person class";
                return new ValidationResult(ErrorMessage);
            }

            var mapGender = typeof(EcMapGender);

            var listOfApprovedGender = mapGender.GetFields().Where(field => field.IsLiteral).Select(field => field.GetValue(null).ToString()).ToList();

            if (!listOfApprovedGender.Contains(person.MpGender))
            {
                ErrorMessage = "Gender must be of a known value";
                return new ValidationResult(ErrorMessage);
            }

            var mapMilAffil = typeof(EcMapAffiliation);

            var listOfApprovedAffil = mapMilAffil.GetFields().Where(field => field.IsLiteral).Select(field => field.GetValue(null).ToString()).ToList();

            if (!listOfApprovedAffil.Contains(person.MpMilAffiliation))
            {
                ErrorMessage = "Military Affiliation must be of a known value";
                return new ValidationResult(ErrorMessage);
            }

            var mapMilPaygrade = typeof(EcMapPaygrade);

            var listOfApprovedPaygrade = mapMilPaygrade.GetFields().Where(field => field.IsLiteral).Select(field => field.GetValue(null).ToString()).ToList();

            if (!listOfApprovedPaygrade.Contains(person.MpMilAffiliation))
            {
                ErrorMessage = "Military Paygrade must be of a known value";
                return new ValidationResult(ErrorMessage);
            }

            var mapMilComponent = typeof(EcMapComponent);

            var listOfApprovedComponent = mapMilComponent.GetFields().Where(field => field.IsLiteral).Select(field => field.GetValue(null).ToString()).ToList();

            if (listOfApprovedComponent.Contains(person.MpMilAffiliation)) return ValidationResult.Success;

            ErrorMessage = "Military Component must be of a known value";

            return new ValidationResult(ErrorMessage);
        }
    }

}