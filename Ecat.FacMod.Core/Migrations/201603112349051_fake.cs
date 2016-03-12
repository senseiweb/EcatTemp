namespace Ecat.FacMod.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fake : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Course",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AcademyId = c.String(maxLength: 50),
                        Name = c.String(maxLength: 50),
                        ClassNumber = c.String(maxLength: 50),
                        Term = c.String(maxLength: 50),
                        GradReportPublished = c.Boolean(nullable: false),
                        StartDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        GradDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FacultyInCourse",
                c => new
                    {
                        FacultyPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => new { t.FacultyPersonId, t.CourseId })
                .ForeignKey("dbo.Course", t => t.CourseId)
                .ForeignKey("dbo.Profile", t => t.FacultyPersonId)
                .Index(t => t.FacultyPersonId)
                .Index(t => t.CourseId);
            
            CreateTable(
                "dbo.FacSpComment",
                c => new
                    {
                        RecipientPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        FacultyPersonId = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        CommentText = c.String(),
                    })
                .PrimaryKey(t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.FacultyInCourse", t => new { t.FacultyPersonId, t.CourseId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .Index(t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => t.CourseId)
                .Index(t => new { t.FacultyPersonId, t.CourseId });
            
            CreateTable(
                "dbo.FacSpCommentFlag",
                c => new
                    {
                        RecipientPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        Faculty = c.String(maxLength: 50),
                        FlaggedByFacultyId = c.Int(nullable: false),
                        Author = c.String(maxLength: 50),
                        Recipient = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.FacSpComment", t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId });
            
            CreateTable(
                "dbo.CrseStudentInGroup",
                c => new
                    {
                        StudentId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.Course", t => t.CourseId)
                .ForeignKey("dbo.StudentInCourse", t => new { t.StudentId, t.CourseId }, cascadeDelete: true)
                .ForeignKey("dbo.Profile", t => t.StudentId)
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .Index(t => new { t.StudentId, t.CourseId })
                .Index(t => t.CourseId)
                .Index(t => t.WorkGroupId);
            
            CreateTable(
                "dbo.SpResponse",
                c => new
                    {
                        AssessorPersonId = c.Int(nullable: false),
                        AssesseePersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        InventoryItemId = c.Int(nullable: false),
                        ItemResponse = c.String(maxLength: 50),
                        ItemModelScore = c.Single(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.AssessorPersonId, t.AssesseePersonId, t.CourseId, t.WorkGroupId, t.InventoryItemId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssessorPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.Course", t => t.CourseId)
                .ForeignKey("dbo.SpInventory", t => t.InventoryItemId)
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .Index(t => new { t.AssessorPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .Index(t => t.InventoryItemId);
            
            CreateTable(
                "dbo.SpInventory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InstrumentId = c.Int(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                        IsDisplayed = c.Boolean(nullable: false),
                        Behavior = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SpInstrument", t => t.InstrumentId, cascadeDelete: true)
                .Index(t => t.InstrumentId);
            
            CreateTable(
                "dbo.SpInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 50),
                        IsActive = c.Boolean(nullable: false),
                        FacultyInstructions = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.WorkGroup",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseId = c.Int(nullable: false),
                        WgModelId = c.Int(nullable: false),
                        Category = c.String(maxLength: 50),
                        GroupNumber = c.String(maxLength: 50),
                        AssignedSpInstrId = c.Int(),
                        AssignedKcInstrId = c.Int(),
                        CustomName = c.String(maxLength: 50),
                        DefaultName = c.String(maxLength: 50),
                        SpStatus = c.String(maxLength: 50),
                        IsPrimary = c.Boolean(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.KcInstrument", t => t.AssignedKcInstrId)
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.WorkGroupModel", t => t.WgModelId, cascadeDelete: true)
                .ForeignKey("dbo.SpInstrument", t => t.AssignedSpInstrId)
                .Index(t => t.CourseId)
                .Index(t => t.WgModelId)
                .Index(t => t.AssignedSpInstrId)
                .Index(t => t.AssignedKcInstrId);
            
            CreateTable(
                "dbo.KcInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Instructions = c.String(maxLength: 50),
                        Version = c.String(maxLength: 50),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FacSpResponse",
                c => new
                    {
                        AssesseePersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        InventoryItemId = c.Int(nullable: false),
                        FacultyPersonId = c.Int(nullable: false),
                        ItemResponse = c.String(maxLength: 50),
                        ItemModelScore = c.Single(nullable: false),
                        ScoreModelVersion = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId, t.InventoryItemId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.FacultyInCourse", t => new { t.FacultyPersonId, t.CourseId })
                .ForeignKey("dbo.SpInventory", t => t.InventoryItemId)
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .Index(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.FacultyPersonId, t.CourseId })
                .Index(t => t.InventoryItemId);
            
            CreateTable(
                "dbo.FacStratResponse",
                c => new
                    {
                        AssesseePersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        StratPosition = c.Int(nullable: false),
                        StratResultId = c.Int(),
                        FacultyPersonId = c.Int(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.FacultyInCourse", t => new { t.FacultyPersonId, t.CourseId })
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.FacultyPersonId, t.CourseId })
                .Index(t => t.WorkGroupId);
            
            CreateTable(
                "dbo.StudSpComment",
                c => new
                    {
                        AuthorPersonId = c.Int(nullable: false),
                        RecipientPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        FacultyPersonId = c.Int(),
                        RequestAnonymity = c.Boolean(nullable: false),
                        CommentText = c.String(),
                        CreatedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.AuthorPersonId, t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AuthorPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId)
                .Index(t => new { t.AuthorPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.RecipientPersonId, t.CourseId, t.WorkGroupId });
            
            CreateTable(
                "dbo.StudSpCommentFlag",
                c => new
                    {
                        AuthorPersonId = c.Int(nullable: false),
                        RecipientPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        AuthorFlag = c.String(maxLength: 50),
                        RecipientFlag = c.String(maxLength: 50),
                        FacultyFlag = c.String(maxLength: 50),
                        FlaggedByFacultyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.AuthorPersonId, t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.StudSpComment", t => new { t.AuthorPersonId, t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.FacultyInCourse", t => new { t.FlaggedByFacultyId, t.CourseId })
                .Index(t => new { t.AuthorPersonId, t.RecipientPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.FlaggedByFacultyId, t.CourseId });
            
            CreateTable(
                "dbo.SpResult",
                c => new
                    {
                        StudentId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        AssignedInstrumentId = c.Int(nullable: false),
                        AssessResult = c.String(maxLength: 50),
                        SpResultScore = c.Single(),
                    })
                .PrimaryKey(t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.SpInstrument", t => t.AssignedInstrumentId)
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId, cascadeDelete: true)
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .Index(t => t.WorkGroupId)
                .Index(t => t.AssignedInstrumentId);
            
            CreateTable(
                "dbo.StratResponse",
                c => new
                    {
                        AssessorPersonId = c.Int(nullable: false),
                        AssesseePersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        StratPosition = c.Int(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.AssessorPersonId, t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.AssessorPersonId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId, cascadeDelete: true)
                .Index(t => new { t.AssessorPersonId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.AssesseePersonId, t.CourseId, t.WorkGroupId });
            
            CreateTable(
                "dbo.StratResult",
                c => new
                    {
                        StudentId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        WorkGroupId = c.Int(nullable: false),
                        OriginalStratPosition = c.Int(nullable: false),
                        FinalStratPosition = c.Int(nullable: false),
                        StratCummScore = c.Single(nullable: false),
                        StratAwardedScore = c.Single(nullable: false),
                    })
                .PrimaryKey(t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .ForeignKey("dbo.WorkGroup", t => t.WorkGroupId, cascadeDelete: true)
                .ForeignKey("dbo.CrseStudentInGroup", t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .Index(t => new { t.StudentId, t.CourseId, t.WorkGroupId })
                .Index(t => t.WorkGroupId);
            
            CreateTable(
                "dbo.WorkGroupModel",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssignedSpInstrId = c.Int(),
                        AssignedKcInstrId = c.Int(),
                        EdLevel = c.String(maxLength: 50),
                        WgCategory = c.String(maxLength: 50),
                        MaxStratStudent = c.Single(nullable: false),
                        MaxStratFaculty = c.Single(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        StratDivisor = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.KcInstrument", t => t.AssignedKcInstrId)
                .ForeignKey("dbo.SpInstrument", t => t.AssignedSpInstrId)
                .Index(t => t.AssignedSpInstrId)
                .Index(t => t.AssignedKcInstrId);
            
            CreateTable(
                "dbo.SpAssessMap",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SpInstrumentId = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        AcademyId = c.String(maxLength: 50),
                        GroupType = c.String(maxLength: 50),
                        AssignedData = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SpInstrument", t => t.SpInstrumentId, cascadeDelete: true)
                .Index(t => t.SpInstrumentId);
            
            CreateTable(
                "dbo.StudentInCourse",
                c => new
                    {
                        StudentPersonId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => new { t.StudentPersonId, t.CourseId })
                .ForeignKey("dbo.Course", t => t.CourseId)
                .ForeignKey("dbo.Profile", t => t.StudentPersonId)
                .Index(t => t.StudentPersonId)
                .Index(t => t.CourseId);
            
            CreateTable(
                "dbo.Profile",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        Bio = c.String(maxLength: 50),
                        HomeStation = c.String(maxLength: 50),
                        ContactNumber = c.String(maxLength: 50),
                        Commander = c.String(maxLength: 50),
                        Shirt = c.String(maxLength: 50),
                        CommanderEmail = c.String(maxLength: 50),
                        ShirtEmail = c.String(maxLength: 50),
                        IsCourseAdmin = c.Boolean(),
                        IsReportViewer = c.Boolean(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.Person",
                c => new
                    {
                        PersonId = c.Int(nullable: false, identity: true),
                        IsActive = c.Boolean(nullable: false),
                        BbUserName = c.String(maxLength: 50),
                        LastName = c.String(maxLength: 50),
                        FirstName = c.String(maxLength: 50),
                        AvatarLocation = c.String(maxLength: 50),
                        GoByName = c.String(maxLength: 50),
                        Gender = c.String(maxLength: 50),
                        Affiliation = c.String(maxLength: 50),
                        Paygrade = c.String(maxLength: 50),
                        Component = c.String(maxLength: 50),
                        Email = c.String(maxLength: 50),
                        RegistrationComplete = c.Boolean(nullable: false),
                        InstituteRole = c.String(maxLength: 50),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.PersonId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.StudSpCommentFlag", new[] { "FlaggedByFacultyId", "CourseId" }, "dbo.FacultyInCourse");
            DropForeignKey("dbo.FacultyInCourse", "FacultyPersonId", "dbo.Profile");
            DropForeignKey("dbo.FacSpComment", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.FacSpComment", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.CrseStudentInGroup", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.CrseStudentInGroup", "StudentId", "dbo.Profile");
            DropForeignKey("dbo.CrseStudentInGroup", new[] { "StudentId", "CourseId" }, "dbo.StudentInCourse");
            DropForeignKey("dbo.StudentInCourse", "StudentPersonId", "dbo.Profile");
            DropForeignKey("dbo.Profile", "PersonId", "dbo.Person");
            DropForeignKey("dbo.StudentInCourse", "CourseId", "dbo.Course");
            DropForeignKey("dbo.StratResult", new[] { "StudentId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.SpResult", new[] { "StudentId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.FacStratResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.CrseStudentInGroup", "CourseId", "dbo.Course");
            DropForeignKey("dbo.SpResponse", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.SpResponse", "InventoryItemId", "dbo.SpInventory");
            DropForeignKey("dbo.SpAssessMap", "SpInstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.SpInventory", "InstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.WorkGroup", "AssignedSpInstrId", "dbo.SpInstrument");
            DropForeignKey("dbo.WorkGroup", "WgModelId", "dbo.WorkGroupModel");
            DropForeignKey("dbo.WorkGroupModel", "AssignedSpInstrId", "dbo.SpInstrument");
            DropForeignKey("dbo.WorkGroupModel", "AssignedKcInstrId", "dbo.KcInstrument");
            DropForeignKey("dbo.StratResult", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.StratResponse", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.StratResponse", new[] { "AssessorPersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.StratResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.SpResult", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.SpResult", "AssignedInstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.StudSpComment", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.StudSpComment", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.StudSpCommentFlag", new[] { "AuthorPersonId", "RecipientPersonId", "CourseId", "WorkGroupId" }, "dbo.StudSpComment");
            DropForeignKey("dbo.StudSpComment", "CourseId", "dbo.Course");
            DropForeignKey("dbo.StudSpComment", new[] { "AuthorPersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.FacStratResponse", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.FacStratResponse", new[] { "FacultyPersonId", "CourseId" }, "dbo.FacultyInCourse");
            DropForeignKey("dbo.FacSpResponse", "WorkGroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.FacSpResponse", "InventoryItemId", "dbo.SpInventory");
            DropForeignKey("dbo.FacSpResponse", new[] { "FacultyPersonId", "CourseId" }, "dbo.FacultyInCourse");
            DropForeignKey("dbo.FacSpResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.WorkGroup", "CourseId", "dbo.Course");
            DropForeignKey("dbo.WorkGroup", "AssignedKcInstrId", "dbo.KcInstrument");
            DropForeignKey("dbo.SpResponse", "CourseId", "dbo.Course");
            DropForeignKey("dbo.SpResponse", new[] { "AssessorPersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.SpResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" }, "dbo.CrseStudentInGroup");
            DropForeignKey("dbo.FacSpCommentFlag", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" }, "dbo.FacSpComment");
            DropForeignKey("dbo.FacSpComment", new[] { "FacultyPersonId", "CourseId" }, "dbo.FacultyInCourse");
            DropForeignKey("dbo.FacSpComment", "CourseId", "dbo.Course");
            DropForeignKey("dbo.FacultyInCourse", "CourseId", "dbo.Course");
            DropIndex("dbo.Profile", new[] { "PersonId" });
            DropIndex("dbo.StudentInCourse", new[] { "CourseId" });
            DropIndex("dbo.StudentInCourse", new[] { "StudentPersonId" });
            DropIndex("dbo.SpAssessMap", new[] { "SpInstrumentId" });
            DropIndex("dbo.WorkGroupModel", new[] { "AssignedKcInstrId" });
            DropIndex("dbo.WorkGroupModel", new[] { "AssignedSpInstrId" });
            DropIndex("dbo.StratResult", new[] { "WorkGroupId" });
            DropIndex("dbo.StratResult", new[] { "StudentId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.StratResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.StratResponse", new[] { "AssessorPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.SpResult", new[] { "AssignedInstrumentId" });
            DropIndex("dbo.SpResult", new[] { "WorkGroupId" });
            DropIndex("dbo.SpResult", new[] { "StudentId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.StudSpCommentFlag", new[] { "FlaggedByFacultyId", "CourseId" });
            DropIndex("dbo.StudSpCommentFlag", new[] { "AuthorPersonId", "RecipientPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.StudSpComment", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.StudSpComment", new[] { "AuthorPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.FacStratResponse", new[] { "WorkGroupId" });
            DropIndex("dbo.FacStratResponse", new[] { "FacultyPersonId", "CourseId" });
            DropIndex("dbo.FacStratResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.FacSpResponse", new[] { "InventoryItemId" });
            DropIndex("dbo.FacSpResponse", new[] { "FacultyPersonId", "CourseId" });
            DropIndex("dbo.FacSpResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.WorkGroup", new[] { "AssignedKcInstrId" });
            DropIndex("dbo.WorkGroup", new[] { "AssignedSpInstrId" });
            DropIndex("dbo.WorkGroup", new[] { "WgModelId" });
            DropIndex("dbo.WorkGroup", new[] { "CourseId" });
            DropIndex("dbo.SpInventory", new[] { "InstrumentId" });
            DropIndex("dbo.SpResponse", new[] { "InventoryItemId" });
            DropIndex("dbo.SpResponse", new[] { "AssesseePersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.SpResponse", new[] { "AssessorPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.CrseStudentInGroup", new[] { "WorkGroupId" });
            DropIndex("dbo.CrseStudentInGroup", new[] { "CourseId" });
            DropIndex("dbo.CrseStudentInGroup", new[] { "StudentId", "CourseId" });
            DropIndex("dbo.FacSpCommentFlag", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.FacSpComment", new[] { "FacultyPersonId", "CourseId" });
            DropIndex("dbo.FacSpComment", new[] { "CourseId" });
            DropIndex("dbo.FacSpComment", new[] { "RecipientPersonId", "CourseId", "WorkGroupId" });
            DropIndex("dbo.FacultyInCourse", new[] { "CourseId" });
            DropIndex("dbo.FacultyInCourse", new[] { "FacultyPersonId" });
            DropTable("dbo.Person");
            DropTable("dbo.Profile");
            DropTable("dbo.StudentInCourse");
            DropTable("dbo.SpAssessMap");
            DropTable("dbo.WorkGroupModel");
            DropTable("dbo.StratResult");
            DropTable("dbo.StratResponse");
            DropTable("dbo.SpResult");
            DropTable("dbo.StudSpCommentFlag");
            DropTable("dbo.StudSpComment");
            DropTable("dbo.FacStratResponse");
            DropTable("dbo.FacSpResponse");
            DropTable("dbo.KcInstrument");
            DropTable("dbo.WorkGroup");
            DropTable("dbo.SpInstrument");
            DropTable("dbo.SpInventory");
            DropTable("dbo.SpResponse");
            DropTable("dbo.CrseStudentInGroup");
            DropTable("dbo.FacSpCommentFlag");
            DropTable("dbo.FacSpComment");
            DropTable("dbo.FacultyInCourse");
            DropTable("dbo.Course");
        }
    }
}
