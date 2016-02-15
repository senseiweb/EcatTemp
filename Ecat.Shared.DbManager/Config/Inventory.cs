using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigSpInventory : EntityTypeConfiguration<SpInventory>
    {
        public ConfigSpInventory()
        {
            Property(p => p.Behavior).HasMaxLength(6000);
           

        }
    }

    public class ConfigKcInventory : EntityTypeConfiguration<KcInventory>
    {
        public ConfigKcInventory()
        {
          
        }
    }


    public class ConfigCogInventory : EntityTypeConfiguration<CogInventory>
    {
        public ConfigCogInventory()
        {
            


        }
    }
}
