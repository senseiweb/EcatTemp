namespace Ecat.Dal.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Academy",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EducationLevel = c.String(maxLength: 250),
                        EpmeSchool = c.Int(nullable: false),
                        BbCategoryId = c.String(maxLength: 250),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Course",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AcademyId = c.Int(nullable: false),
                        BbCourseId = c.String(maxLength: 60),
                        Name = c.String(maxLength: 250),
                        ClassNumber = c.String(maxLength: 250),
                        Term = c.String(maxLength: 250),
                        StartDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        GradDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Academy", t => t.AcademyId, cascadeDelete: true)
                .Index(t => t.AcademyId)
                .Index(t => t.BbCourseId, unique: true, name: "IX_UniqueBbCourseId");
            
            CreateTable(
                "dbo.Group",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SpInstrumentId = c.Int(),
                        KcInstrumentId = c.Int(),
                        CourseId = c.Int(nullable: false),
                        Category = c.String(maxLength: 4),
                        GroupNumber = c.String(maxLength: 6),
                        CustomName = c.String(maxLength: 250),
                        BbGroupId = c.String(maxLength: 250),
                        DefaultName = c.String(maxLength: 250),
                        MaxStrat = c.Single(nullable: false),
                        SpStatus = c.Int(nullable: false),
                        IsHomeGroup = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.KcInstrument", t => t.KcInstrumentId)
                .ForeignKey("dbo.SpInstrument", t => t.SpInstrumentId)
                .Index(t => t.SpInstrumentId)
                .Index(t => t.KcInstrumentId)
                .Index(t => new { t.CourseId, t.GroupNumber, t.Category }, unique: true, name: "IX_UniqueCourseGroup");
            
            CreateTable(
                "dbo.KcInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(nullable: false),
                        Instructions = c.String(maxLength: 250),
                        Version = c.String(maxLength: 250),
                        IsActive = c.Boolean(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.Person",
                c => new
                    {
                        PersonId = c.Int(nullable: false, identity: true),
                        BbUserId = c.String(maxLength: 20),
                        BbUserName = c.String(maxLength: 250),
                        LastName = c.String(nullable: false, maxLength: 250),
                        FirstName = c.String(nullable: false, maxLength: 250),
                        AvatarLocation = c.String(maxLength: 250),
                        GoByName = c.String(maxLength: 250),
                        Gender = c.String(nullable: false, maxLength: 250),
                        MilAffiliation = c.String(nullable: false, maxLength: 250),
                        MilPaygrade = c.String(nullable: false, maxLength: 250),
                        MilComponent = c.String(nullable: false, maxLength: 250),
                        Email = c.String(nullable: false, maxLength: 250),
                        IsRegistrationComplete = c.Boolean(nullable: false),
                        InstituteRole = c.String(nullable: false, maxLength: 250),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.Email, unique: true, name: "IX_UniqueEmailAddress")
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.CourseMember",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseId = c.Int(nullable: false),
                        PersonId = c.Int(nullable: false),
                        CourseRole = c.String(maxLength: 250),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseId)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => new { t.CourseId, t.PersonId }, unique: true, name: "IX_UniqueCourseMember")
                .Index(t => t.DeletedById);
            
            CreateTable(
                "dbo.GroupMember",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        MemberId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ModifiedById = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .ForeignKey("dbo.Group", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.CourseMember", t => t.MemberId)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => new { t.GroupId, t.MemberId }, unique: true, name: "IX_UniqueGroupMember")
                .Index(t => t.DeletedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpAssessResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssessorId = c.Int(nullable: false),
                        AssesseeId = c.Int(nullable: false),
                        RelatedInventoryId = c.Int(nullable: false),
                        AssessResultId = c.Int(),
                        SpItemResponse = c.Int(nullable: false),
                        ItemResponseScore = c.Single(nullable: false),
                        ScoreModelVersion = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ModifiedById = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GroupMember", t => t.AssesseeId)
                .ForeignKey("dbo.GroupMember", t => t.AssessorId)
                .ForeignKey("dbo.SpAssessResult", t => t.AssessResultId)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .ForeignKey("dbo.SpInventory", t => t.RelatedInventoryId)
                .Index(t => new { t.AssessorId, t.AssesseeId }, unique: true, name: "IX_UniqueSpResponse")
                .Index(t => t.RelatedInventoryId)
                .Index(t => t.AssessResultId)
                .Index(t => t.DeletedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpAssessResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GrpMemberId = c.Int(nullable: false),
                        SpInstrumentId = c.Int(nullable: false),
                        AssessResult = c.String(maxLength: 250),
                        AssessResultScore = c.Single(nullable: false),
                        ScoreModelVersion = c.Int(nullable: false),
                        ResponseCount = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GroupMember", t => t.GrpMemberId, cascadeDelete: true)
                .ForeignKey("dbo.SpInstrument", t => t.SpInstrumentId, cascadeDelete: true)
                .Index(t => t.GrpMemberId)
                .Index(t => t.SpInstrumentId);
            
            CreateTable(
                "dbo.SpInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        Version = c.String(maxLength: 250),
                        SelfInstructions = c.String(maxLength: 250),
                        PeerInstructions = c.String(maxLength: 250),
                        InstructorInstructions = c.String(maxLength: 250),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpInventory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InstrumentId = c.Int(nullable: false),
                        ModifiedById = c.Int(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                        IsScored = c.Boolean(nullable: false),
                        IsDisplayed = c.Boolean(nullable: false),
                        SelfBehavior = c.String(maxLength: 250),
                        PeerBehavior = c.String(maxLength: 250),
                        InstructorBehavior = c.String(maxLength: 250),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SpInstrument", t => t.InstrumentId, cascadeDelete: true)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.InstrumentId)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpStratResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssessorId = c.Int(nullable: false),
                        AssesseeId = c.Int(nullable: false),
                        StratPosition = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ModifiedById = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GroupMember", t => t.AssesseeId)
                .ForeignKey("dbo.GroupMember", t => t.AssessorId)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .ForeignKey("dbo.Person", t => t.ModifiedById, cascadeDelete: true)
                .Index(t => new { t.AssessorId, t.AssesseeId }, unique: true, name: "IX_UniqueStratResponse")
                .Index(t => t.DeletedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpComment",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AuthorId = c.Int(nullable: false),
                        RecipientId = c.Int(nullable: false),
                        CommentType = c.String(maxLength: 250),
                        CommentText = c.String(maxLength: 250),
                        InstructorFlag = c.String(maxLength: 250),
                        RecipientFlag = c.String(maxLength: 250),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ModifiedById = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GroupMember", t => t.AuthorId)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .ForeignKey("dbo.Person", t => t.ModifiedById, cascadeDelete: true)
                .ForeignKey("dbo.GroupMember", t => t.RecipientId)
                .Index(t => new { t.AuthorId, t.RecipientId }, unique: true, name: "IX_UniqueSpComment")
                .Index(t => t.DeletedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.SpStratResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GrpMemberId = c.Int(nullable: false),
                        ScoreModelVersion = c.Int(nullable: false),
                        StratPosition = c.Int(nullable: false),
                        StratScore = c.Single(nullable: false),
                        VoteCount = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GroupMember", t => t.GrpMemberId, cascadeDelete: true)
                .Index(t => t.GrpMemberId);
            
            CreateTable(
                "dbo.External",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        HomeStation = c.String(maxLength: 250),
                        Bio = c.String(maxLength: 250),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.Facilitator",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        Bio = c.String(maxLength: 250),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.Security",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        PasswordHash = c.String(maxLength: 250),
                        TempPassword = c.String(maxLength: 250),
                        PasswordExpire = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.Student",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        ContactNumber = c.String(maxLength: 15),
                        HomeStation = c.String(nullable: false, maxLength: 50),
                        UnitCommander = c.String(nullable: false, maxLength: 100),
                        UnitCommanderEmail = c.String(nullable: false, maxLength: 50),
                        UnitFirstSergeant = c.String(nullable: false, maxLength: 100),
                        UnitFirstSergeantEmail = c.String(nullable: false, maxLength: 50),
                        Bio = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.KcResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InstrumentId = c.Int(nullable: false),
                        NumberCorrect = c.Int(nullable: false),
                        Score = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.KcInstrument", t => t.InstrumentId, cascadeDelete: true)
                .Index(t => t.InstrumentId);
            
            CreateTable(
                "dbo.CogInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(nullable: false),
                        Version = c.String(maxLength: 250),
                        IsActive = c.Boolean(nullable: false),
                        CogInstructions = c.String(maxLength: 250),
                        CogInstrumentType = c.String(maxLength: 250),
                        CogResultRange = c.String(maxLength: 250),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.ModifiedById);
            
            CreateTable(
                "dbo.CogInventory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(nullable: false),
                        InstrumentId = c.Int(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                        IsScored = c.Boolean(nullable: false),
                        IsDisplayed = c.Boolean(nullable: false),
                        AdaptiveDescription = c.String(maxLength: 250),
                        InnovativeDescription = c.String(maxLength: 250),
                        ItemDescription = c.String(maxLength: 250),
                        IsReversed = c.Boolean(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CogInstrument", t => t.InstrumentId, cascadeDelete: true)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.ModifiedById)
                .Index(t => t.InstrumentId);
            
            CreateTable(
                "dbo.CogResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CogInventoryItem = c.Int(nullable: false),
                        ItemScore = c.Single(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.DeletedById)
                .Index(t => t.DeletedById);
            
            CreateTable(
                "dbo.CogResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CogOutcome = c.String(maxLength: 250),
                        CogScore = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.KcInventory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(nullable: false),
                        InstrumentId = c.Int(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                        IsScored = c.Boolean(nullable: false),
                        IsDisplayed = c.Boolean(nullable: false),
                        KnowledgeArea = c.String(maxLength: 250),
                        QuestionText = c.String(maxLength: 250),
                        ItemWeight = c.Single(nullable: false),
                        Answer = c.String(maxLength: 250),
                        ModifiedDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.KcInstrument", t => t.InstrumentId, cascadeDelete: true)
                .ForeignKey("dbo.Person", t => t.ModifiedById)
                .Index(t => t.ModifiedById)
                .Index(t => t.InstrumentId);
            
            CreateTable(
                "dbo.KcResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InventoryId = c.Int(nullable: false),
                        ResultId = c.Int(),
                        IsCorrect = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.KcInventory", t => t.InventoryId, cascadeDelete: true)
                .ForeignKey("dbo.KcResult", t => t.ResultId)
                .Index(t => t.InventoryId)
                .Index(t => t.ResultId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.KcResponse", "ResultId", "dbo.KcResult");
            DropForeignKey("dbo.KcResponse", "InventoryId", "dbo.KcInventory");
            DropForeignKey("dbo.KcInventory", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.KcInventory", "InstrumentId", "dbo.KcInstrument");
            DropForeignKey("dbo.CogResponse", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.CogInventory", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.CogInventory", "InstrumentId", "dbo.CogInstrument");
            DropForeignKey("dbo.CogInstrument", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.KcResult", "InstrumentId", "dbo.KcInstrument");
            DropForeignKey("dbo.KcInstrument", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.Student", "PersonId", "dbo.Person");
            DropForeignKey("dbo.Security", "PersonId", "dbo.Person");
            DropForeignKey("dbo.Person", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.Facilitator", "PersonId", "dbo.Person");
            DropForeignKey("dbo.External", "PersonId", "dbo.Person");
            DropForeignKey("dbo.CourseMember", "PersonId", "dbo.Person");
            DropForeignKey("dbo.SpStratResult", "GrpMemberId", "dbo.GroupMember");
            DropForeignKey("dbo.GroupMember", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.GroupMember", "MemberId", "dbo.CourseMember");
            DropForeignKey("dbo.GroupMember", "GroupId", "dbo.Group");
            DropForeignKey("dbo.GroupMember", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.SpComment", "RecipientId", "dbo.GroupMember");
            DropForeignKey("dbo.SpComment", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.SpComment", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.SpComment", "AuthorId", "dbo.GroupMember");
            DropForeignKey("dbo.SpStratResponse", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.SpStratResponse", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.SpStratResponse", "AssessorId", "dbo.GroupMember");
            DropForeignKey("dbo.SpStratResponse", "AssesseeId", "dbo.GroupMember");
            DropForeignKey("dbo.SpAssessResponse", "RelatedInventoryId", "dbo.SpInventory");
            DropForeignKey("dbo.SpAssessResponse", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.SpAssessResponse", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.SpAssessResponse", "AssessResultId", "dbo.SpAssessResult");
            DropForeignKey("dbo.SpAssessResult", "SpInstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.SpInstrument", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.SpInventory", "ModifiedById", "dbo.Person");
            DropForeignKey("dbo.SpInventory", "InstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.Group", "SpInstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.SpAssessResult", "GrpMemberId", "dbo.GroupMember");
            DropForeignKey("dbo.SpAssessResponse", "AssessorId", "dbo.GroupMember");
            DropForeignKey("dbo.SpAssessResponse", "AssesseeId", "dbo.GroupMember");
            DropForeignKey("dbo.CourseMember", "DeletedById", "dbo.Person");
            DropForeignKey("dbo.CourseMember", "CourseId", "dbo.Course");
            DropForeignKey("dbo.Group", "KcInstrumentId", "dbo.KcInstrument");
            DropForeignKey("dbo.Group", "CourseId", "dbo.Course");
            DropForeignKey("dbo.Course", "AcademyId", "dbo.Academy");
            DropIndex("dbo.KcResponse", new[] { "ResultId" });
            DropIndex("dbo.KcResponse", new[] { "InventoryId" });
            DropIndex("dbo.KcInventory", new[] { "InstrumentId" });
            DropIndex("dbo.KcInventory", new[] { "ModifiedById" });
            DropIndex("dbo.CogResponse", new[] { "DeletedById" });
            DropIndex("dbo.CogInventory", new[] { "InstrumentId" });
            DropIndex("dbo.CogInventory", new[] { "ModifiedById" });
            DropIndex("dbo.CogInstrument", new[] { "ModifiedById" });
            DropIndex("dbo.KcResult", new[] { "InstrumentId" });
            DropIndex("dbo.Student", new[] { "PersonId" });
            DropIndex("dbo.Security", new[] { "PersonId" });
            DropIndex("dbo.Facilitator", new[] { "PersonId" });
            DropIndex("dbo.External", new[] { "PersonId" });
            DropIndex("dbo.SpStratResult", new[] { "GrpMemberId" });
            DropIndex("dbo.SpComment", new[] { "ModifiedById" });
            DropIndex("dbo.SpComment", new[] { "DeletedById" });
            DropIndex("dbo.SpComment", "IX_UniqueSpComment");
            DropIndex("dbo.SpStratResponse", new[] { "ModifiedById" });
            DropIndex("dbo.SpStratResponse", new[] { "DeletedById" });
            DropIndex("dbo.SpStratResponse", "IX_UniqueStratResponse");
            DropIndex("dbo.SpInventory", new[] { "ModifiedById" });
            DropIndex("dbo.SpInventory", new[] { "InstrumentId" });
            DropIndex("dbo.SpInstrument", new[] { "ModifiedById" });
            DropIndex("dbo.SpAssessResult", new[] { "SpInstrumentId" });
            DropIndex("dbo.SpAssessResult", new[] { "GrpMemberId" });
            DropIndex("dbo.SpAssessResponse", new[] { "ModifiedById" });
            DropIndex("dbo.SpAssessResponse", new[] { "DeletedById" });
            DropIndex("dbo.SpAssessResponse", new[] { "AssessResultId" });
            DropIndex("dbo.SpAssessResponse", new[] { "RelatedInventoryId" });
            DropIndex("dbo.SpAssessResponse", "IX_UniqueSpResponse");
            DropIndex("dbo.GroupMember", new[] { "ModifiedById" });
            DropIndex("dbo.GroupMember", new[] { "DeletedById" });
            DropIndex("dbo.GroupMember", "IX_UniqueGroupMember");
            DropIndex("dbo.CourseMember", new[] { "DeletedById" });
            DropIndex("dbo.CourseMember", "IX_UniqueCourseMember");
            DropIndex("dbo.Person", new[] { "ModifiedById" });
            DropIndex("dbo.Person", "IX_UniqueEmailAddress");
            DropIndex("dbo.KcInstrument", new[] { "ModifiedById" });
            DropIndex("dbo.Group", "IX_UniqueCourseGroup");
            DropIndex("dbo.Group", new[] { "KcInstrumentId" });
            DropIndex("dbo.Group", new[] { "SpInstrumentId" });
            DropIndex("dbo.Course", "IX_UniqueBbCourseId");
            DropIndex("dbo.Course", new[] { "AcademyId" });
            DropTable("dbo.KcResponse");
            DropTable("dbo.KcInventory");
            DropTable("dbo.CogResult");
            DropTable("dbo.CogResponse");
            DropTable("dbo.CogInventory");
            DropTable("dbo.CogInstrument");
            DropTable("dbo.KcResult");
            DropTable("dbo.Student");
            DropTable("dbo.Security");
            DropTable("dbo.Facilitator");
            DropTable("dbo.External");
            DropTable("dbo.SpStratResult");
            DropTable("dbo.SpComment");
            DropTable("dbo.SpStratResponse");
            DropTable("dbo.SpInventory");
            DropTable("dbo.SpInstrument");
            DropTable("dbo.SpAssessResult");
            DropTable("dbo.SpAssessResponse");
            DropTable("dbo.GroupMember");
            DropTable("dbo.CourseMember");
            DropTable("dbo.Person");
            DropTable("dbo.KcInstrument");
            DropTable("dbo.Group");
            DropTable("dbo.Course");
            DropTable("dbo.Academy");
        }
    }
}
