using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : BaseController
    {
        private readonly IForwarderService _forwarderService;

        public AuditLogController(IForwarderService forwarderService)
        {
            _forwarderService = forwarderService;
        }

        [HttpPost]
        [Route("Search")]
        public async Task<object> Report([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }
    }
}