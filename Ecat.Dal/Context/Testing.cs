using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Text;

namespace Ecat.Dal.Context
{
    public class TestCtx : EcatCtx
    {
        public TestCtx() : base("TestDbConnection")
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<TestCtx>());
        }

    }

    public class TestConfig : DbMigrationsConfiguration<TestCtx>
    {
        public TestConfig()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
        }

        /// <summary>
        /// Runs after upgrading to the latest migration to allow seed data to be updated.
        /// </summary>
        /// <remarks>
        /// Note that the database may already contain seed data when this method runs. This means that
        ///             implementations of this method must check whether or not seed data is present and/or up-to-date
        ///             and then only make changes if necessary and in a non-destructive way. The 
        ///             <see cref="M:System.Data.Entity.Migrations.DbSetMigrationsExtensions.AddOrUpdate``1(System.Data.Entity.IDbSet{``0},``0[])"/>
        ///             can be used to help with this, but for seeding large amounts of data it may be necessary to do less
        ///             granular checks if performance is an issue.
        ///             If the <see cref="T:System.Data.Entity.MigrateDatabaseToLatestVersion`2"/> database 
        ///             initializer is being used, then this method will be called each time that the initializer runs.
        ///             If one of the <see cref="T:System.Data.Entity.DropCreateDatabaseAlways`1"/>, <see cref="T:System.Data.Entity.DropCreateDatabaseIfModelChanges`1"/>,
        ///             or <see cref="T:System.Data.Entity.CreateDatabaseIfNotExists`1"/> initializers is being used, then this method will not be
        ///             called and the Seed method defined in the initializer should be used instead.
        /// </remarks>
        /// <param name="context">Context to be used for updating seed data. </param>
        protected override void Seed(TestCtx context)
        {
            if (Debugger.IsAttached != false)
            {
                Debugger.Launch();

            };

            try
            {


            }
            catch (DbEntityValidationException ex)
            {
                foreach (var eve in ex.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }

                Debug.WriteLine(ex);
                throw;
            }
        }

        private static void SaveChanges(DbContext context)
        {
            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                var sb = new StringBuilder();

                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }

                throw new DbEntityValidationException("Entity Validation Failed - errors follow:\n" + sb.ToString(), ex);
                // Add the original exception as the innerException
            }
        }
    }
}
