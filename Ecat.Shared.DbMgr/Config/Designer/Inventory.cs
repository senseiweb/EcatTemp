﻿using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Designer;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigSpInventory : EntityTypeConfiguration<SpInventory>
    {
        public ConfigSpInventory()
        {
            Property(p => p.Behavior).IsMaxLength();
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
