using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApi.Common.Enumerations;

namespace WebApi.Infrastructure.Filters
{
    public class UpdatePermissionFilter : AuthorizationHandler<UpdatePermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UpdatePermissionRequirement requirement)
        {
            var claims = context.User.Identities.FirstOrDefault();
            var roles = claims?.Claims.Where(row => row.Type.Equals(ClaimTypes.Role)).Select(row => row.Value).ToArray();
            if (roles == null)
            {
                context.Fail();

                return Task.CompletedTask;
            }

            if (roles.Contains(PermissionEnum.SupperAdmin.ToString()))
            {
                context.Succeed(requirement);

                return Task.CompletedTask;
            }

            var action = (context.Resource as AuthorizationFilterContext)?.RouteData.Values.FirstOrDefault().Value;

            if (action == null)
            {
                context.Fail();

                return Task.CompletedTask;
            }

            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }

    public class UpdatePermissionRequirement : IAuthorizationRequirement
    {
    }
}