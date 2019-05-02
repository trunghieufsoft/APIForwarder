using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemConfigController : BaseController
    {
        private readonly IForwarderService _forwarderService;

        public SystemConfigController(IForwarderService forwarderService)
        {
            _forwarderService = forwarderService;
        }

        [HttpPost]
        [Route("Update")]
        public async Task<object> Update([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<object> GetAll()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }
    }
}