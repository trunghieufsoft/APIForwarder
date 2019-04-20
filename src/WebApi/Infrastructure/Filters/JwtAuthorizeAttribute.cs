using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using WebApi.Common.Enumerations;

namespace WebApi.Infrastructure.Filters
{
    public class JwtAuthorizeAttribute : AuthorizeAttribute
    {
        public JwtAuthorizeAttribute(params PermissionEnum[] permissions)
        {
            Policy = "I2KPolicy";

            Roles = string.Join(",", permissions);

            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
        }

        public JwtAuthorizeAttribute()
        {
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
        }
    }
}
