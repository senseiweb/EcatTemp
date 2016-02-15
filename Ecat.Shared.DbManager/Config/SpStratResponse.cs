using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.Entity.ModelConfiguration;
using Ecat.Shared.Model;

namespace Ecat.Shared.DbManager.Config
{
    public class ConfigSpStratResponse: EntityTypeConfiguration<SpStratResponse>
    {
        public ConfigSpStratResponse()
        {
            HasRequired(p => p.Assessee)
             .WithMany(p => p.AssesseeStratResponse)
             .HasForeignKey(p => p.AssesseeId)
             .WillCascadeOnDelete(false);

            HasRequired(p => p.Assessor)
               .WithMany(p => p.AssessorStratResponse)
               .HasForeignKey(p => p.AssessorId)
               .WillCascadeOnDelete(false);

            Property(p => p.AssesseeId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute("IX_AssessorUniqueStratsInGroup", 1) { IsUnique = true }));

            //Add index for unique combination of assessor's GroupMemberId and StratPosition
            Property(p => p.AssessorId)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                new IndexAnnotation(new IndexAttribute("IX_AssessorUniqueStratsInGroup", 2) { IsUnique = true }));

            Property(p => p.StratPosition)
                .HasColumnAnnotation(IndexAnnotation.AnnotationName,
                new IndexAnnotation(new IndexAttribute("IX_AssessorUniqueStratsInGroup", 3) { IsUnique = true }));
        }
    }
}
