using System;
using System.Net;
using System.Net.Http;
using System.ServiceModel;
using System.Threading.Tasks;
using System.Web.Http;
using Ecat.Dal.BbWs.Context;

namespace Ecat.Dal
{
    public class BbUserCheckWrapper : IBbUserCheckWrapper
    {
        public bool BbUserValid { get; private set; }

        public async Task<bool> HasValidateCredentials(string bbUid, string bbPass)
        {
            var endPoint = new EndpointAddress("https://barnescenter.blackboard.com/webapps/ws/services/Context.WS");

            var anonymousContext = new ContextWSPortTypeClient(new BasicHttpsBinding { MaxReceivedMessageSize = 2147483647 }, endPoint);

            anonymousContext.Endpoint.Behaviors.Add(
                   new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", "nosession"))));

            var contextResult = await anonymousContext.initializeAsync();

            var authContext = new ContextWSPortTypeClient(new BasicHttpsBinding { MaxReceivedMessageSize = 2147483647 }, endPoint);

            authContext.Endpoint.Behaviors.Add(new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", contextResult.@return))));

            loginResponse loginResult = null;

            try
            {
                loginResult = await authContext.loginAsync(bbUid, bbPass, "EPME", "ECAT", null, 60);
            }
            catch (Exception)
            {
                var reject = new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content = new StringContent($"Could not validate account: {bbUid}. Please check the username/password combination and retry."),
                    ReasonPhrase = "Blackboard Account Validation Failed"
                };
                throw new HttpResponseException(reject);
            }

            if (loginResult == null || !loginResult.@return) return BbUserValid;

            BbUserValid = loginResult.@return;
#pragma warning disable 4014
            anonymousContext.logoutAsync();
            authContext.logoutAsync();
#pragma warning restore 4014

            return BbUserValid;
        }

    }
}
