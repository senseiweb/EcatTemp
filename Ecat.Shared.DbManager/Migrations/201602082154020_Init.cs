namespace Ecat.Shared.DbManager
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Academy",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Base = c.String(),
                        MpEdLevel = c.String(),
                        BbCategoryId = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Course",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AcademyId = c.Int(nullable: false),
                        BbCourseId = c.String(),
                        Name = c.String(),
                        ClassNumber = c.String(),
                        Term = c.String(),
                        StartDate = c.DateTime(nullable: false),
                        GradDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Academy", t => t.AcademyId, cascadeDelete: true)
                .Index(t => t.AcademyId);
            
            CreateTable(
                "dbo.MemberInCourse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseId = c.Int(nullable: false),
                        PersonId = c.Int(nullable: false),
                        MpCourseRole = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(),
                        DeletedBy_PersonId = c.Int(),
                        Person_PersonId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.Person", t => t.DeletedBy_PersonId)
                .ForeignKey("dbo.Person", t => t.Person_PersonId)
                .Index(t => t.CourseId)
                .Index(t => t.DeletedBy_PersonId)
                .Index(t => t.Person_PersonId);
            
            CreateTable(
                "dbo.Person",
                c => new
                    {
                        PersonId = c.Int(nullable: false, identity: true),
                        IsActive = c.Boolean(nullable: false),
                        BbUserId = c.String(maxLength: 20),
                        BbUserName = c.String(),
                        LastName = c.String(nullable: false),
                        FirstName = c.String(nullable: false),
                        AvatarLocation = c.String(),
                        GoByName = c.String(),
                        MpGender = c.String(nullable: false),
                        MpAffiliation = c.String(nullable: false),
                        MpPaygrade = c.String(nullable: false),
                        MpComponent = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        RegistrationComplete = c.Boolean(nullable: false),
                        MpInstituteRole = c.String(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PersonId)
                .Index(t => t.Email, unique: true, name: "IX_UniqueEmailAddress");
            
            CreateTable(
                "dbo.Profile",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        Bio = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.Security",
                c => new
                    {
                        PersonId = c.Int(nullable: false),
                        PasswordHash = c.String(),
                    })
                .PrimaryKey(t => t.PersonId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.MemberInGroup",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        CourseEnrollmentId = c.Int(nullable: false),
                        PersonId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                        MemberInGroup_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MemberInCourse", t => t.CourseEnrollmentId, cascadeDelete: true)
                .ForeignKey("dbo.WorkGroup", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.MemberInGroup", t => t.MemberInGroup_Id)
                .ForeignKey("dbo.Person", t => t.PersonId, cascadeDelete: true)
                .Index(t => t.GroupId)
                .Index(t => t.CourseEnrollmentId)
                .Index(t => t.PersonId)
                .Index(t => t.MemberInGroup_Id);
            
            CreateTable(
                "dbo.WorkGroup",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssignedSpInstrId = c.Int(nullable: false),
                        AssignedKcInstrId = c.Int(nullable: false),
                        CourseId = c.Int(nullable: false),
                        MpCategory = c.String(),
                        GroupNumber = c.String(),
                        CustomName = c.String(),
                        BbGroupId = c.String(),
                        DefaultName = c.String(),
                        MaxStrat = c.Single(nullable: false),
                        MpSpStatus = c.String(),
                        IsPrimary = c.Boolean(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                        SpInstrument_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Course", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.SpInstrument", t => t.SpInstrument_Id)
                .Index(t => t.CourseId)
                .Index(t => t.SpInstrument_Id);
            
            CreateTable(
                "dbo.SpInstrument",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModifiedById = c.Int(),
                        MpEdLevel = c.String(),
                        GroupType = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        ScoreModelVersion = c.Int(nullable: false),
                        Version = c.String(),
                        SelfInstructions = c.String(),
                        PeerInstructions = c.String(),
                        FacilitatorInstructions = c.String(),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SpInventory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InstrumentId = c.Int(nullable: false),
                        ModifiedById = c.Int(),
                        DisplayOrder = c.Int(nullable: false),
                        IsScored = c.Boolean(nullable: false),
                        IsDisplayed = c.Boolean(nullable: false),
                        Behavior = c.String(),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SpInstrument", t => t.InstrumentId, cascadeDelete: true)
                .Index(t => t.InstrumentId);
            
            CreateTable(
                "dbo.SpStudResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssessorId = c.Int(nullable: false),
                        AssesseeId = c.Int(nullable: false),
                        InventoryItemId = c.Int(nullable: false),
                        AssessResultId = c.Int(),
                        MpItemResponse = c.String(),
                        ItemModelScore = c.Single(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MemberInGroups", t => t.AssesseeId)
                .ForeignKey("dbo.MemberInGroups", t => t.AssessorId)
                .ForeignKey("dbo.SpInventory", t => t.InventoryItemId)
                .Index(t => new { t.AssessorId, t.AssesseeId, t.InventoryItemId }, unique: true, name: "IX_UniqueSpResponse");
            
            CreateTable(
                "dbo.MemberInGroups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        CourseEnrollmentId = c.Int(nullable: false),
                        PersonId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.WorkGroup", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Person", t => t.PersonId, cascadeDelete: true)
                .Index(t => t.GroupId)
                .Index(t => t.PersonId);
            
            CreateTable(
                "dbo.SpStratResponse",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssessorId = c.Int(nullable: false),
                        AssesseeId = c.Int(nullable: false),
                        StratPosition = c.Int(nullable: false),
                        StratResultId = c.Int(),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                        StudInGroup_Id = c.Int(),
                        StudInGroup_Id1 = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MemberInGroups", t => t.AssesseeId, cascadeDelete: true)
                .ForeignKey("dbo.MemberInGroups", t => t.AssessorId, cascadeDelete: true)
                .ForeignKey("dbo.SpStratResult", t => t.StratResultId)
                .ForeignKey("dbo.MemberInGroups", t => t.StudInGroup_Id)
                .ForeignKey("dbo.MemberInGroups", t => t.StudInGroup_Id1)
                .Index(t => t.AssessorId)
                .Index(t => t.AssesseeId)
                .Index(t => t.StratResultId)
                .Index(t => t.StudInGroup_Id)
                .Index(t => t.StudInGroup_Id1);
            
            CreateTable(
                "dbo.SpStratResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GrpMemberId = c.Int(nullable: false),
                        FacStratResponseId = c.Int(nullable: false),
                        OriginalStratPosition = c.Int(nullable: false),
                        FinalStratPosition = c.Int(nullable: false),
                        StratScore = c.Single(nullable: false),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                        GrpMember_PersonId = c.Int(),
                        StudInGroup_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Person", t => t.GrpMember_PersonId)
                .ForeignKey("dbo.MemberInGroups", t => t.StudInGroup_Id)
                .Index(t => t.GrpMember_PersonId)
                .Index(t => t.StudInGroup_Id);
            
            CreateTable(
                "dbo.SpAssessResult",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ResultForId = c.Int(nullable: false),
                        AssignedInstrumentId = c.Int(nullable: false),
                        MpSpResult = c.String(),
                        MpSpResultScore = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SpInstrument", t => t.AssignedInstrumentId, cascadeDelete: true)
                .ForeignKey("dbo.MemberInGroups", t => t.ResultForId, cascadeDelete: true)
                .Index(t => t.ResultForId)
                .Index(t => t.AssignedInstrumentId);
            
            CreateTable(
                "dbo.SpComment",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AuthorId = c.Int(nullable: false),
                        RecipientId = c.Int(nullable: false),
                        FacFlaggedById = c.Int(nullable: false),
                        MpCommentType = c.String(),
                        CommentText = c.String(),
                        MpCommentFlagFac = c.String(),
                        MpCommentFlagAuthor = c.String(),
                        MpCommentFlagRecipient = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedById = c.Int(),
                        DeletedDate = c.DateTime(),
                        ModifiedById = c.Int(),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.MemberInGroups", t => t.AuthorId)
                .ForeignKey("dbo.MemberInGroups", t => t.RecipientId)
                .Index(t => t.AuthorId)
                .Index(t => t.RecipientId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SpStudResponse", "InventoryItemId", "dbo.SpInventory");
            DropForeignKey("dbo.SpStudResponse", "AssessorId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpStudResponse", "AssesseeId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpStratResult", "StudInGroup_Id", "dbo.MemberInGroups");
            DropForeignKey("dbo.MemberInGroups", "PersonId", "dbo.Person");
            DropForeignKey("dbo.MemberInGroups", "GroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.SpComment", "RecipientId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpComment", "AuthorId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpAssessResult", "ResultForId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpAssessResult", "AssignedInstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.SpStratResponse", "StudInGroup_Id1", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpStratResponse", "StudInGroup_Id", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpStratResponse", "StratResultId", "dbo.SpStratResult");
            DropForeignKey("dbo.SpStratResult", "GrpMember_PersonId", "dbo.Person");
            DropForeignKey("dbo.SpStratResponse", "AssessorId", "dbo.MemberInGroups");
            DropForeignKey("dbo.SpStratResponse", "AssesseeId", "dbo.MemberInGroups");
            DropForeignKey("dbo.MemberInGroup", "PersonId", "dbo.Person");
            DropForeignKey("dbo.MemberInGroup", "MemberInGroup_Id", "dbo.MemberInGroup");
            DropForeignKey("dbo.SpInventory", "InstrumentId", "dbo.SpInstrument");
            DropForeignKey("dbo.WorkGroup", "SpInstrument_Id", "dbo.SpInstrument");
            DropForeignKey("dbo.MemberInGroup", "GroupId", "dbo.WorkGroup");
            DropForeignKey("dbo.WorkGroup", "CourseId", "dbo.Course");
            DropForeignKey("dbo.MemberInGroup", "CourseEnrollmentId", "dbo.MemberInCourse");
            DropForeignKey("dbo.MemberInCourse", "Person_PersonId", "dbo.Person");
            DropForeignKey("dbo.MemberInCourse", "DeletedBy_PersonId", "dbo.Person");
            DropForeignKey("dbo.Security", "PersonId", "dbo.Person");
            DropForeignKey("dbo.Profile", "PersonId", "dbo.Person");
            DropForeignKey("dbo.MemberInCourse", "CourseId", "dbo.Course");
            DropForeignKey("dbo.Course", "AcademyId", "dbo.Academy");
            DropIndex("dbo.SpComment", new[] { "RecipientId" });
            DropIndex("dbo.SpComment", new[] { "AuthorId" });
            DropIndex("dbo.SpAssessResult", new[] { "AssignedInstrumentId" });
            DropIndex("dbo.SpAssessResult", new[] { "ResultForId" });
            DropIndex("dbo.SpStratResult", new[] { "StudInGroup_Id" });
            DropIndex("dbo.SpStratResult", new[] { "GrpMember_PersonId" });
            DropIndex("dbo.SpStratResponse", new[] { "StudInGroup_Id1" });
            DropIndex("dbo.SpStratResponse", new[] { "StudInGroup_Id" });
            DropIndex("dbo.SpStratResponse", new[] { "StratResultId" });
            DropIndex("dbo.SpStratResponse", new[] { "AssesseeId" });
            DropIndex("dbo.SpStratResponse", new[] { "AssessorId" });
            DropIndex("dbo.MemberInGroups", new[] { "PersonId" });
            DropIndex("dbo.MemberInGroups", new[] { "GroupId" });
            DropIndex("dbo.SpStudResponse", "IX_UniqueSpResponse");
            DropIndex("dbo.SpInventory", new[] { "InstrumentId" });
            DropIndex("dbo.WorkGroup", new[] { "SpInstrument_Id" });
            DropIndex("dbo.WorkGroup", new[] { "CourseId" });
            DropIndex("dbo.MemberInGroup", new[] { "MemberInGroup_Id" });
            DropIndex("dbo.MemberInGroup", new[] { "PersonId" });
            DropIndex("dbo.MemberInGroup", new[] { "CourseEnrollmentId" });
            DropIndex("dbo.MemberInGroup", new[] { "GroupId" });
            DropIndex("dbo.Security", new[] { "PersonId" });
            DropIndex("dbo.Profile", new[] { "PersonId" });
            DropIndex("dbo.Person", "IX_UniqueEmailAddress");
            DropIndex("dbo.MemberInCourse", new[] { "Person_PersonId" });
            DropIndex("dbo.MemberInCourse", new[] { "DeletedBy_PersonId" });
            DropIndex("dbo.MemberInCourse", new[] { "CourseId" });
            DropIndex("dbo.Course", new[] { "AcademyId" });
            DropTable("dbo.SpComment");
            DropTable("dbo.SpAssessResult");
            DropTable("dbo.SpStratResult");
            DropTable("dbo.SpStratResponse");
            DropTable("dbo.MemberInGroups");
            DropTable("dbo.SpStudResponse");
            DropTable("dbo.SpInventory");
            DropTable("dbo.SpInstrument");
            DropTable("dbo.WorkGroup");
            DropTable("dbo.MemberInGroup");
            DropTable("dbo.Security");
            DropTable("dbo.Profile");
            DropTable("dbo.Person");
            DropTable("dbo.MemberInCourse");
            DropTable("dbo.Course");
            DropTable("dbo.Academy");
        }
    }
}
