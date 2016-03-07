using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.ModelLibrary.Faculty;

namespace Ecat.Shared.DbMgr.Config
{
    public class ConfigFacSpComment : EntityTypeConfiguration<FacSpComment>
    {
        public ConfigFacSpComment()
        {
            HasKey(p => new {p.StudentPersonId, p.CourseId, p.WorkGroupId, p.Version});

            Property(p => p.CommentText).IsMaxLength();

            HasRequired(p => p.FacultyCourse)
                 .WithMany(p => p.SpComments)
                 .HasForeignKey(p => new { p.FacultyPersonId, p.CourseId })
                 .WillCascadeOnDelete(false);

            HasRequired(p => p.Student)
                .WithMany()
                .HasForeignKey(p => new { p.StudentPersonId, p.CourseId, p.WorkGroupId })
                .WillCascadeOnDelete(false);

            HasRequired(p => p.WorkGroup)
                .WithMany(p => p.FacSpComments)
                .HasForeignKey(p => p.WorkGroupId)
                .WillCascadeOnDelete(false);


        }
    }
}
