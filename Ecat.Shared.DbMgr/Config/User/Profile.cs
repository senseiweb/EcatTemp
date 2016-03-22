using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.User;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigProfile : EntityTypeConfiguration<ProfileBase>
    {
        public ConfigProfile()
        {
            ToTable("Profile");
            HasKey(p => p.PersonId);

            Property(p => p.Bio)
                .HasMaxLength(6000);
        }
    }
}
