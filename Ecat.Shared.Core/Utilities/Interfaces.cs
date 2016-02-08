﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Model;

namespace Ecat.Shared.Core
{
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }
        int? DeletedById { get; set; }
        DateTime? DeletedDate { get; set; }
    }

    public interface IAuditable
    {
        int? ModifiedById { get; set; }
        DateTime ModifiedDate { get; set; }
    }
}
