using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Text;
using System.Threading.Tasks;
using Ecat.Shared.Core.Utility;
using Ecat.Shared.DbMgr.BbWs.BbCourse;
using Ecat.Shared.DbMgr.BbWs.Context;

namespace Ecat.Shared.DbMgr.Context
{
    public class BbWsCnet
    {
        private const string BaseUrl = "https://barnescenter.blackboard.com/webapps/ws/services";
        private const string VendorId = "EPME";
        private const string ProgramId = "Ecat";
        private const string Secret = "p0i38e382ur";
        private readonly BasicHttpsBinding _defaultBinding;
        private readonly string _sessionKey;

        public BbWsCnet()
        {
            _defaultBinding = new BasicHttpsBinding { MaxReceivedMessageSize = 2147483647 };
            _sessionKey = BbWsStatus.SessionActive ? BbWsStatus.SessionKey : "nosession";
        }

        private async Task Activate()
        {
            if (BbWsStatus.SessionActive)
            {
                await Task.FromResult(0);
            }

            var endpoint = new EndpointAddress($"{BaseUrl}/Context.WS");
            var context = new ContextWSPortTypeClient(_defaultBinding, endpoint);
            context.Endpoint.Behaviors.Add(
                new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));

            var returnedSessionKey = await context.initializeAsync();

            var initializedContext = new ContextWSPortTypeClient(_defaultBinding, endpoint);

            initializedContext.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", returnedSessionKey.@return))));

            try
            {
                var loginResults = await context.loginToolAsync(Secret, VendorId, ProgramId, null, 1500);
                var success = loginResults.@return;

                if (!success) throw new HttpRequestException();

                BbWsStatus.SessionKey = returnedSessionKey.@return;
                BbWsStatus.LoginExpire = DateTime.Now;
            }
            catch (Exception)
            {
                throw new HttpRequestException();
            }

        }

        public async Task<CourseWSPortTypeClient> GetCourseClient()
        {
            await Activate();
            var endpoint = new EndpointAddress($"{BaseUrl}/Course.WS");
            var course  = new CourseWSPortTypeClient(_defaultBinding, endpoint);
            course.Endpoint.Behaviors.Add(
                new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));
            await course.initializeCourseWSAsync(false);
            return course;
        }

    }

    public static class BbWsStatus
    {
        private static readonly object SessionKeyLock = new object();
        private static readonly object LoginExpireLock = new object();
        private static DateTime _loginExpire;
        private static string _sessionKey;

        public static string SessionKey
        {
            get { return _sessionKey; }
            set
            {
                lock (SessionKeyLock)
                {
                    _sessionKey = value;
                }
            }
        }

        public static DateTime LoginExpire
        {
            set
            {
                lock (LoginExpireLock)
                {
                    _loginExpire = value.AddMinutes(15);
                }
            }
        }

        public static bool SessionActive => DateTime.Now <= _loginExpire;

    }
}
