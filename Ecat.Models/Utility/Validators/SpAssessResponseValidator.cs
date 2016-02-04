using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using System.Diagnostics.Contracts;

namespace Ecat.Models
{
    [AttributeUsage(AttributeTargets.Class)]
    public class spAssessResponseMappedPropValid : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var spAssessResponse = value as SpAssessResponse;
            Contract.Assert(spAssessResponse != null);

            var itemReponse = typeof(EcSpItemResponse);

            var listOfApprovedResponses = itemReponse.GetFields()
                .Where(field => field.IsLiteral)
                .Select(field => field.GetValue(null).ToString()).ToList();

            if (!listOfApprovedResponses.Contains(spAssessResponse.MpSpItemResponse))
            {
                ErrorMessage = "Item Response must be of known value.";
                return new ValidationResult(ErrorMessage);
            }

            return base.IsValid(value, validationContext);
        }
    }
}