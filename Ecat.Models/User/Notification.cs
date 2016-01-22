using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ecat.Models
{
    public class EcUserNotify
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public string Notification { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ReceiptDate { get; set; }
        public EcPerson Recipient { get; set; }
    }
}