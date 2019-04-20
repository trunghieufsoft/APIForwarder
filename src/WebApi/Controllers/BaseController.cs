using System;
using Serilog;
using System.Linq;
using WebApi.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class BaseController : Controller
    {
        public override JsonResult Json(object data)
        {
            return new JsonResult(new ResponseModel
            {
                Data = data
            });
        }

        protected string GetUserIdFromRequestHeader()
        {
            Log.Debug(Request.Headers.Keys
                .Aggregate(
                    string.Empty,
                    (current, key) =>
                        current + key + "=" + Request.Headers[key] + Environment.NewLine));

            return Request.Headers["HTTP_CT_REMOTE_USER"];
        }

        protected string GetTokenFromRequestHeader()
        {
            string authorization = Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization))
            {
                return string.Empty;
            }
            return authorization.Replace("Bearer ", string.Empty);
        }
    }
}