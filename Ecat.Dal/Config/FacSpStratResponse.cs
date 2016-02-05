using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;
using Ecat.Models;

namespace Ecat.Dal.Config
{
    public class ConfigFacSpStratResponse : EntityTypeConfiguration<FacSpStratResponse>
    {
        public ConfigFacSpStratResponse()
        {
            HasOptional(p => p.StratResult)
                .WithRequired(p => p.FacStratResponse)
                .WillCascadeOnDelete(false);

        }
    }
}