using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Ecat.Dal;
using Ecat.Models;
using LtiLibrary.AspNet.Extensions;
using LtiLibrary.Core.Lti1;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ecat.Appl.Controllers
{
    public class LtiController : Controller
    {
        private readonly IUserLogic _userLogic;

        private const string LtiSecret = "keiri9303iei32-1a;vdap3";

        public LtiController(IUserLogic userLogic)
        {
            _userLogic = userLogic;
        }

        public string Ping()
        {
            return "Pong";
        }

        [HttpPost]
        public async Task<ActionResult> Secure()
        {
            try
            {
                Request.CheckForRequiredLtiParameters();
            }
            catch
            {
                ViewBag.Uid = 0;
                return View();
            }

            var ltiRequest = new LtiRequest();

            ltiRequest.ParseRequest(Request);

            //var expectedOauthSignature = Request.GenerateOAuthSignature(LtiSecret);

            //if (!expectedOauthSignature.Equals(ltiRequest.Signature))
            //{
            //    ViewBag.Error = "Unauthorized Signature of Data Call";
            //    return View("Error");
            //};

            var self = await _userLogic.GetPerson(0, ltiRequest.LisPersonEmailPrimary);

            self = await UpdateSelf(self, ltiRequest);
            var loginToken = new LoginToken
            {
                PersonId = self.PersonId,
                Person = self
            };

            var loginTk = _userLogic.GetUserSecurityToken(loginToken, true);
            var settings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            ViewBag.User = JsonConvert.SerializeObject(loginTk, settings);

            return View();
        }

        private async Task<EcPerson> UpdateSelf(EcPerson self, ILtiRequest request)
        {
            var newGuy = self.PersonId == 0;

            if (newGuy)
            {
                self.MpMilAffiliation = EcMapAffiliation.Unk;
                self.MpMilComponent = EcMapComponent.Unk;
                self.MpMilPaygrade = EcMapPaygrade.Unk;
                self.MpGender = EcMapGender.Unk;
                self.IsRegistrationComplete = false;
            }

            self.Email = request.LisPersonEmailPrimary;
            self.LastName = request.LisPersonNameFamily;
            self.FirstName = request.LisPersonNameGiven;
            self.BbUserId = request.UserId;
            self.ModifiedDate = DateTime.Now;

            var userVo = await _userLogic.GetBbPerson(self.BbUserId);

            if (userVo != null)
            {
                self.MpInstituteRole = _userLogic.DecipherInstituteRole(userVo.insRoles);
                self.BbUserName = userVo.name;
            }
            else
            {
                self.MpInstituteRole = EcMapInstituteRole.External;
            }

            if (!newGuy)
            {
                self.ModifiedById = self.PersonId;
            }

            if (await _userLogic.SaveChangesSuccess(self) && !newGuy) return self;

            self.ModifiedById = self.PersonId;

            if (await _userLogic.SaveChangesSuccess(self))
            {
                return self;
            }

            throw new DBConcurrencyException("Save changes method failed");
        }

    }
}
