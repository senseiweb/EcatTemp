using System;
using System.Net;
using System.Net.Http;
using System.ServiceModel;
using System.Threading.Tasks;
using System.Web.Http;
using Ecat.Dal.BbWs.BbUser;
using Ecat.Dal.BbWs.Context;
using Ecat.Dal.BbWs.Course;
using Ecat.Dal.BbWs.CourseMember;
using Ecat.Models;

namespace Ecat.Dal
{
    public class BbWsWrapper : IBbWrapper
    {
        private static readonly string BaseUrl;

        private const string VendorId = "EPME";
        private const string ProgramId = "Ecat";

        private static bool IsInitialized
        {
            get
            {
                var now = DateTime.Now;

                if (_contextTimeout > now) return true;

                KillContexts();

                return false;
            }
        }

        private static readonly object FlagLock = new object();
        private static readonly object SessionKeyLock = new object();
        private static readonly object ContextLock = new object();
        private static readonly object ContentLock = new object();
        private static readonly object CourseLock = new object();
        private static readonly object CourseMemLock = new object();
        private static readonly object UserLock = new object();

        private static string _sessionKey;
        private static DateTime _contextTimeout;
        private static readonly BasicHttpsBinding DefaultBinding;
        private static ContextWSPortTypeClient _context;
        private static CourseWSPortTypeClient _course;
        private static CourseMembershipWSPortTypeClient _courseMembership;
        private static UserWSPortTypeClient _user;

        //private static bool _contextInitialized;
        private static bool _courseInitialized;
        //private static bool _contentInitialized;
        //private static bool _announcementInitialized;
        //private static bool _calendarInitialized;
        //private static bool _gradebookInitialized;
        //private static bool _notificationInitialized;
        private static bool _userInitialized;
        //private static bool _utilInitialized;
        private static bool _courseMembershipInitialized;


        static BbWsWrapper()
        {
            BaseUrl = "https://barnescenter.blackboard.com/webapps/ws/services";
            DefaultBinding = new BasicHttpsBinding { MaxReceivedMessageSize = 2147483647 };
        }

        private static async Task Initialize() // Must be called before anything else except getServerVersions
        {
            var isLoginSuccessful = false;

            try
            {
                PrepContext();

                var contextResults = await _context.initializeAsync();

                lock (SessionKeyLock)
                {
                    _sessionKey = contextResults.@return;
                }

                isLoginSuccessful = await LoginTool();

                if (!isLoginSuccessful)
                {
                    throw new EndpointNotFoundException();
                }

                PrepCourse();
                PrepCourseMembership();
                PrepUser();
            }
            catch (Exception e)
            {
                //Need to research why I put this code here!!!
                if (e.Message.IndexOf("Context.WS003", StringComparison.InvariantCultureIgnoreCase) > -1)
                {
                    isLoginSuccessful = false;
                }
            }

            if (!isLoginSuccessful)
            {
                var result =
                    await
                        RegisterTool("auBlackboardAuWebService2501026", "Epme Ecat Tool Registration", "p0i38e382ur",
                            EcMapToken.TokenMethods, null);

                if (result.statusSpecified && result.status)
                {
                    //Send a message to the admin or post an issue on our bitbucket account;
                }
            }

        }

        private static void KillContexts()
        {
            lock (FlagLock)
            {
                _sessionKey = null;
                _user = null;
                _course = null;
                _context = null;
                _courseMembership = null;
               // _contextInitialized = false;
                _courseInitialized = false;
                //_contentInitialized = false;
                //_announcementInitialized = false;
                //_calendarInitialized = false;
                //_gradebookInitialized = false;
                //_notificationInitialized = false;
                _userInitialized = false;
               // _utilInitialized = false;
                _courseMembershipInitialized = false;

            }
        }

        private static async Task<bool> LoginTool()
        {
            lock (ContextLock)
            {
                var endpoint = new EndpointAddress($"{BaseUrl}/Context.WS");
                _context = new ContextWSPortTypeClient(DefaultBinding, endpoint);

                _context.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));
            }
            try
            {
                var loginResults = await _context.loginToolAsync("p0i38e382ur", "EPME", "ECAT", null, 1200);
                var loginResult = loginResults.@return;
                lock (ContextLock)
                {
                    _contextTimeout = DateTime.Now.AddSeconds(1200);
                }

                return loginResult;

            }
            catch (Exception ex)
            {
                var reject = new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content =
                        new StringContent(
                            $"Link to Bb Webservices Failed: Link Time: {_contextTimeout} Session: {_sessionKey}. Error: {ex}"),
                    ReasonPhrase = "Bb Webservices Failed Connection"
                };
                throw new HttpResponseException(reject);
            }
        }

        public async Task<bool> LoginUser(string userId, string userPassword)
        {
            try
            {
                var result = await _context.loginAsync(userId, userPassword, VendorId, ProgramId, null, 500);
                return result.@return;
            }
            catch
            {
                return false;
            }
        }

        private static void PrepContext()
        {
            lock (ContextLock)
            {
                var endpoint = new EndpointAddress($"{BaseUrl}/Context.WS");
                _context = new ContextWSPortTypeClient(DefaultBinding, endpoint);
                _sessionKey = "nosession";

                _context.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));
            }
        }

        private static void PrepCourse()
        {
            lock (CourseLock)
            {
                var endpoint = new EndpointAddress($"{BaseUrl}/Course.WS");
                _course = new CourseWSPortTypeClient(DefaultBinding, endpoint);
                _course.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));
            }

        }

        private static void PrepCourseMembership()
        {
            lock (CourseMemLock)
            {
                var endpoint = new EndpointAddress($"{BaseUrl}/CourseMembership.WS");
                _courseMembership = new CourseMembershipWSPortTypeClient(DefaultBinding, endpoint);
                _courseMembership.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));

            }
        }

        private static void PrepUser()
        {
            lock (UserLock)
            {
                var endpoint = new EndpointAddress($"{BaseUrl}/User.WS");
                _user = new UserWSPortTypeClient(DefaultBinding, endpoint);
                _user.Endpoint.Behaviors.Add(
                    new WsSecurityBehavior(new MessageInspector(new SecurityHeader("session", _sessionKey))));
            }
        }

        public static async Task<RegisterToolResultVO> RegisterTool(string toolRegistrationPassword, string description,
            string initialSharedSecret, string[] requiredToolMethods, string[] requiredTicketMethods)
        {
            var result =
                await
                    _context.registerToolAsync(VendorId, ProgramId, toolRegistrationPassword, description,
                        initialSharedSecret, requiredToolMethods, requiredTicketMethods);
            return result.@return;
        }

        public async Task<CourseMembershipWSPortTypeClient> GetCourseMembershipClient()
        {

            if (!IsInitialized)
            {
                await Initialize();
            }

            if (_courseMembershipInitialized) return _courseMembership;

            var courseMemberResponse = await _courseMembership.initializeCourseMembershipWSAsync(false);

            lock (CourseMemLock)
            {
                _courseMembershipInitialized = courseMemberResponse.@return;

            }

            return (_courseMembershipInitialized) ? _courseMembership : null;
        }

        public async Task<CourseWSPortTypeClient> GetCourseClient()
        {
            if (!IsInitialized)
            {
                await Initialize();
            }

            if (_courseInitialized) return _course;

            var courseResponse = await _course.initializeCourseWSAsync(false);

            lock (CourseLock)
            {
                _courseInitialized = courseResponse.@return;
            }

            return (_courseInitialized) ? _course : null;
        }

        public async Task<UserWSPortTypeClient> GetUserClient()
        {
            if (!IsInitialized)
            {
                await Initialize();
            }

            if (_userInitialized) return _user;

            var userResponse = await _user.initializeUserWSAsync(false);

            lock (UserLock)
            {
                _userInitialized = userResponse.@return;
            }

            return (_userInitialized) ? _user : null;
        }
    }


}
