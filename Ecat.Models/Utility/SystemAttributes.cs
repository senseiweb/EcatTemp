using System;
using System.Web;
using System.Web.Http;

namespace Ecat.Models
{
    [AttributeUsage(AttributeTargets.Property)]
    public class UserSgAttribute : Attribute
    {
        public string Name { get; private set; }
        public UserRoleType[] Allowed { get; private set; }
        public UserSgAttribute(string name, params UserRoleType[] allowed)
        {
            Name = name;
            Allowed = allowed;
        }
    }
}
