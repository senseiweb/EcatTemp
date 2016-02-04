using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecat.Dal;
using Breeze.ContextProvider.EF6;
using Ecat.Dal.Context;
using Ecat.Models;
using Xunit;
using Breeze.ContextProvider;
namespace Ecat.Tests
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public class StudentSaveguardTestFixture
    {

        public StudentSaveguard Sut { get; set; }
        public EFContextProvider<EcatCtx> ctxProvider = new EFContextProvider<EcatCtx>();

        public StudentSaveguardTestFixture()
        {
            var person = new EcPerson
            {
                LastName = "Smith",
                FirstName = "Bob",
                MpInstituteRole = EcMapInstituteRole.Student
            };

            Sut = new StudentSaveguard(new EcatCtx(), person);

        }

    }

    public class StudentSaveguardUnitTest
    {
        [Fact]
        [Trait("Student", "Saveguard")]
        public void Should_ThrowUnauthorizedAccessException_When_PersonNotStudent()
        {
            var person = new EcPerson
            {
                PersonId = 10021,
                LastName = "Smith",
                FirstName = "Bob",
                MpGender = EcMapGender.Female,
                MpMilAffiliation = EcMapAffiliation.Usaf,
                MpInstituteRole = EcMapInstituteRole.Facilitator
            };

            var ctx = new EcatCtx();
            var ctxProvider = new EFContextProvider<EcatCtx>();

            var exception = Assert.Throws<UnauthorizedAccessException>(() => new StudentSaveguard(ctx, person));
        }

        [Fact]
        [Trait("Student", "Saveguard")]
        public void Should_ThrowEntityExceptionError_When_ListOfOnlyInvalidTypes() 
        {
            var person = new EcPerson
            {
				PersonId = 10021,
                LastName = "Smith",
                FirstName = "Bob",
                MpGender = EcMapGender.Female,
                MpMilAffiliation = EcMapAffiliation.Usaf,
                MpInstituteRole = EcMapInstituteRole.Student
            };

            var ctx = new EcatCtx();
            var ctxProvider = new EFContextProvider<EcatCtx>();

            var sut = new StudentSaveguard(ctx, person);

            var academy1 = new EcAcademy();
            var group = new EcGroup();
            var acadInfo = ctxProvider.CreateEntityInfo(academy1);
            var groupInfo = ctxProvider.CreateEntityInfo(group);
            var personInfor = ctxProvider.CreateEntityInfo(person);

            var badTestMap = new SaveMap
            {
                {typeof(EcAcademy), new List<EntityInfo>{acadInfo}},
                {typeof(EcGroup), new List<EntityInfo> { groupInfo}},
                {typeof(EcPerson), new List<EntityInfo> {personInfor } }
            };

            var exception = Assert.Throws<ArgumentException>(() => sut.BeforeSaveEntities(badTestMap));
        }

        [Fact]
        [Trait("Student", "Saveguard")]
        //[Trait("Student", "Assessments")]
        public void Should_ThrowEntityErrorsException_When_ListOnlyDeleteEntityStates()
        {
            var person = new EcPerson
            {
                PersonId = 10021,
                LastName = "Smith",
                FirstName = "Bob",
                MpGender = EcMapGender.Female,
                MpMilAffiliation = EcMapAffiliation.Usaf,
                MpInstituteRole = EcMapInstituteRole.Student
            };

            var ctx = new EcatCtx();
            var ctxProvider = new EFContextProvider<EcatCtx>();

            var sut = new StudentSaveguard(ctx, person);

            var spAssessResponse = new SpAssessResponse();
            var spAssessResponse2 = new SpAssessResponse();
            var spARInfo = ctxProvider.CreateEntityInfo(spAssessResponse, EntityState.Deleted);
            var spARInfo2 = ctxProvider.CreateEntityInfo(spAssessResponse2, EntityState.Deleted);

            var testMap = new SaveMap
            {
                {typeof(SpAssessResponse), new List<EntityInfo> { spARInfo, spARInfo2 } }
            };

            var exception = Assert.Throws<EntityErrorsException>(() => sut.BeforeSaveEntities(testMap));
        }

        [Fact]
        [Trait("Student", "Saveguard")]
        //[Trait("Student", "Assessments")]
        public void Should_ThrowEntityErrorsException_When_ListOnlyDeletedOrAssessorNotLoggedInUser()
        {
            var person = new EcPerson
            {
                PersonId = 10021,
                LastName = "Smith",
                FirstName = "Bob",
                MpGender = EcMapGender.Female,
                MpMilAffiliation = EcMapAffiliation.Usaf,
                MpInstituteRole = EcMapInstituteRole.Student
            };

            var groupMember = new EcGroupMember
            {
                Id = 1245,
                GroupId = 56,
                MemberId = 14
            };

            var ctx = new EcatCtx();
            var ctxProvider = new EFContextProvider<EcatCtx>();

            var sut = new StudentSaveguard(ctx, person);

            var spAssessResponse = new SpAssessResponse();
            var spAssessResponse2 = new SpAssessResponse
            {
                Id = 1,
                AssessorId = 12,
                AssesseeId = 13,
                RelatedInventoryId = 1,
                MpSpItemResponse = "Not Displayed"
            };

            var spARInfo = ctxProvider.CreateEntityInfo(spAssessResponse, EntityState.Deleted);
            var spARInfo2 = ctxProvider.CreateEntityInfo(spAssessResponse2, EntityState.Modified);

            var testMap = new SaveMap
            {
                {typeof(SpAssessResponse), new List<EntityInfo> { spARInfo, spARInfo2 } }
            };

            var exception = Assert.Throws<EntityErrorsException>(() => sut.BeforeSaveEntities(testMap));
        }
    }

}
