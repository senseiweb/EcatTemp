﻿using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Faculty;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigFacSpResponse : EntityTypeConfiguration<FacSpResponse>
    {
        public ConfigFacSpResponse()
        {
            HasKey(p => new {p.AssesseePersonId, p.CourseId, p.WorkGroupId, p.InventoryItemId});


            HasRequired(p => p.FacultyAssessor)
                .WithMany(p => p.FacSpResponses)
                .HasForeignKey(p => new { p.FacultyPersonId, p.CourseId })
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Assessee)
                .WithMany()
                .HasForeignKey(p => new { p.AssesseePersonId, p.CourseId, p.WorkGroupId })
                .WillCascadeOnDelete(false);

            HasRequired(p => p.InventoryItem)
                .WithMany()
                .HasForeignKey(p => p.InventoryItemId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.WorkGroup)
                .WithMany(p => p.FacSpResponses)
                .HasForeignKey(p => p.WorkGroupId)
                .WillCascadeOnDelete(false);

        }
    }
}
