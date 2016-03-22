﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.School;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigWorkGroup : EntityTypeConfiguration<WorkGroup>
    {
        public ConfigWorkGroup()
        {
            Property(p => p.CourseId)
               .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                   new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 1) { IsUnique = true }));

            Property(p => p.GroupNumber)
                .HasMaxLength(6)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 2) { IsUnique = true }));

            Property(p => p.MpCategory)
                .HasMaxLength(4)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_UniqueCourseGroup", 3) { IsUnique = true }));

            Ignore(p => p.CanPublish);
        }
    }
}
