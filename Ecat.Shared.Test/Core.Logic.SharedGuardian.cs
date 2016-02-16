using System;
using System.Collections.Generic;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Ecat.Shared.Core;
using Ecat.Shared.Core.Logic;
using Ecat.Shared.DbManager.Config;
using Ecat.Shared.DbManager.Context;
using Ecat.Shared.Model;
using Xunit;

namespace Ecat.Shared.Test
{
    public class SharedLogicSharedGuardians
    {
        [Fact]
        public void Should_ThrowEntityErrors_When_UserIsNull()
        {
            #region Arrange
            var sut = new SharedGuardian();
            var efCtx = new EFContextProvider<EcatContext>();
            var entity = new Person();
            var infos = efCtx.CreateEntityInfo(entity);
            var infoList = new List<EntityInfo> {infos};
            #endregion

            #region Act / Assert
            Assert.Throws<EntityErrorsException>(() => sut.DeleteGuardian(ref infoList, null));
            #endregion

            #region Assert
            #endregion
        }

        [Fact]
        public void Should_MarkDeletableItems_When_MapHasDeletedItems()
        {
            #region Arrange
            var sut = new SharedGuardian();
            var efCtx = new EFContextProvider<EcatContext>();
            var entity = new Person();
            var infos = efCtx.CreateEntityInfo(entity);
            var infoList = new List<EntityInfo> { infos };
            #endregion
        }

        [Fact]
        public void Should_RemoveDeletableItems_When_MapHasNonDeletableItems()
        {
            
        }
    }
}
