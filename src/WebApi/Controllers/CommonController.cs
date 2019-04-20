using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : BaseController
    {
        private readonly IForwarderService _forwarderService;

        public CommonController(IForwarderService forwarderService)
        {
            _forwarderService = forwarderService;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetAllGroup")]
        public async Task<object> GetAllGroup()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetAllCountry")]
        public async Task<object> GetAllCountry()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("GetUsersAssign")]
        public async Task<object> GetUsersAssign(string username)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());
            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString() + "?username=" + username, null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("GetUsersAllTypeAssignByCountry")]
        public async Task<object> GetUsersAllTypeAssignByCountry(string userType, string country = null)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString() + "?userType=" + userType + "&country=" + country, null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }
    }
}