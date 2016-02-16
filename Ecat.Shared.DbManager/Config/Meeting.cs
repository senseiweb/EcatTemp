using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigMeeting : EntityTypeConfiguration<Meeting>
    {
        public ConfigMeeting()
        {
            HasMany(p => p.Attendees)
                .WithRequired()
                .WillCascadeOnDelete(false);
         }
    }
}
