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
    public class ConfigCrseStudInGroup : EntityTypeConfiguration<CrseStudentInGroup>
    {
        public ConfigCrseStudInGroup()
        {
            HasKey(p => new { p.StudentId, p.CourseId, p.WorkGroupId });

            HasRequired(p => p.StudentInCourse)
                .WithMany(p => p.WorkGroupEnrollments)
                .HasForeignKey(p => new { p.StudentId, p.CourseId })
                .WillCascadeOnDelete(true);

            HasRequired(p => p.WorkGroup)
                .WithMany(p => p.GroupMembers)
                .HasForeignKey(p =>p.WorkGroupId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.StudentProfile)
                .WithMany(p => p.CourseGroupMemberships)
                .HasForeignKey(p => p.StudentId)
                .WillCascadeOnDelete(false);

            HasRequired(p => p.Course)
                .WithMany(p => p.StudentInCrseGroups)
                .HasForeignKey(p => p.CourseId)
                .WillCascadeOnDelete(false);

            Ignore(p => p.GroupPeers);
            Ignore(p => p.NumOfStratIncomplete);
            Ignore(p => p.NumberOfAuthorComments);

            HasOptional(p => p.SpResult)
                .WithRequired(p => p.ResultFor);

            HasOptional(p => p.StratResult)
                .WithRequired(p => p.ResultFor);

            HasOptional(p => p.FacultyStrat)
                .WithRequired(p => p.StudentAssessee);
        }
    }
}
