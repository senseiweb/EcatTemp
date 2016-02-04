//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Web.Http;
//using Breeze.ContextProvider;
//using Breeze.ContextProvider.EF6;
//using Ecat.Dal;
//using Ecat.Dal.Context;
//using Xunit;
//using Moq;
//using Ecat.Models;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using Assert = Xunit.Assert;


//namespace Ecat.Tests
//{
//    using SaveMap = Dictionary<Type, List<EntityInfo>>;

//    public class MockEntityInfo : EntityInfo
//    {
//        public new object Entity { get; set; }
//    }

//    public class AnonymousUserSgTestFixture
//    {
//        private EFContextProvider<EcatCtx> ctxProvider = new EFContextProvider<EcatCtx>();

       

//        public AnonymousUserSgTestFixture()
//        {
//            Sut = new UserSaveguard(new EcatCtx(), new EcPerson() );
//        }

//        public UserSaveguard Sut { get; set; }
//    }

//    public class AnonymouseUserSgTests: IClassFixture<AnonymousUserSgTestFixture>
//    {
//        [Fact]
//        [Trait("Category", "SavingPersonType")]
//        public void Should_ThrowInvalidOperation_When_AnonymousUserMuliptlePersonEntityInfoAreProvided(AnonymousUserSgTestFixture fixture)
//        {
//            var sut = fixture.Sut;

//            var ei1 = new MockEntityInfo {  Entity = new EcPerson() } as EntityInfo;

//            var ei2 = new MockEntityInfo { Entity = new EcPerson()} as EntityInfo;

//            var saveMap = new SaveMap
//            {
//                {typeof (EcPerson), new List<EntityInfo> {ei1, ei2} },
//            };

//            var ex = Assert.Throws<InvalidOperationException>(() => sut.BeforeSaveEntities(saveMap));
//            Assert.Equal("Sequence contains more than one element", ex.Message);
//        }

//        [Theory]
//        [InlineData(EntityState.Added, true)]
//        [InlineData(EntityState.Modified, false)]
//        [InlineData(EntityState.Deleted, false )]
//        [Trait("Category", "SavingPersonType")]
//        public void Should_AllowedPkChanges_When_PersonStateIsAdded(EntityState state, bool outcome)
//        {
//            var sut = new UserSaveguard(new EcatCtx(), new EcPerson());

//            var ei = new MockEntityInfo
//            {
//               Entity = new EcPerson {PersonId = 1, Email = "me@me.com"},
//               EntityState = state,
//               OriginalValuesMap = new Dictionary<string, object> { { "PersonId", null} }
//            } as EntityInfo;

//            var saveMap = new SaveMap
//            {
//                {typeof (EcPerson), new List<EntityInfo> {ei} },
//            };

//            var returnedMap = sut.BeforeSaveEntities(saveMap);

//            Assert.Equal(returnedMap.Single().Value.First().OriginalValuesMap.ContainsKey("PersonId"), outcome);
//        }
//    }
//}
