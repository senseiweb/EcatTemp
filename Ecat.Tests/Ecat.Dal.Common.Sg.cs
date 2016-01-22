using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.ContextProvider;
using Ecat.Dal;
using Ecat.Models;
using Xunit;

namespace Ecat.Tests
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    //public class CommonUserSgTests
    //{

    //    [Fact]
    //    public void Should_ThrowBadRequestError_When_NoValidUserTypesExist(AnonymousUserSgTestFixture fixture)
    //    {
    //        var sut = new UserSaveguard(fixture.Ctx, fixture.Person);

    //        var saveMap = new Dictionary<,>
    //        {
    //            {typeof (EcGroup), new List<EntityInfo>()},
    //            {typeof (EcGroupMember), new List<EntityInfo>()}
    //        };

    //        var ex = Assert.Throws<HttpResponseException>(() => sut.BeforeSaveEntities(saveMap));
    //        Assert.Equal(HttpStatusCode.BadRequest, ex.Response.StatusCode);
    //    }
    //}
}
