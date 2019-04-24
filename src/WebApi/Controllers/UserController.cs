using System;
using System.Net.Http;
using WebApi.Common.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IConfiguration _config;
        private readonly IForwarderService _forwarderService;

        public UserController(IConfiguration config, IForwarderService forwarderService)
        {
            _config = config;
            _forwarderService = forwarderService;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("WebLogin")]
        public async Task<object> WebLogin([FromBody] LoginInput requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("CreateManager")]
        public async Task<object> CreateManager([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("CreateStaff")]
        public async Task<object> CreateStaff([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("CreateEmployee")]
        public async Task<object> CreateEmployee([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("AssignUsers")]
        public async Task<object> AssignUsesr([FromBody] UserAssign requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString() + "?username=" + requestDto.Username, requestDto.Username, HttpMethod.Put);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("UpdateManager")]
        public async Task<object> UpdateManager([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("UpdateStaff")]
        public async Task<object> UpdateStaff([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("UpdateEmployee")]
        public async Task<object> UpdateEmployee([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("Delete")]
        public async Task<object> Delete([FromBody] UserDelete requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString() + "?id=" + requestDto.Id, requestDto.Id, HttpMethod.Delete);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("View")]
        public async Task<object> View(Guid id)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString() + "?id=" + id, id, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("Search/ManagerAdmin")]
        public async Task<object> SearchManager([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("Search/Staff")]
        public async Task<object> SearchStaff([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("Search/Employee")]
        public async Task<object> SearchEmployee([FromBody] object requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("AllowUnselectGroups")]
        public async Task<object> AllowUnselectGroups([FromBody] UnselectGroupsInput requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("ChangePassword")]
        public async Task<object> ChangePassword([FromBody] ChangePasswordInput requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Put);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("TotalUsers")]
        public async Task<object> TotalUsers()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("GetProfile")]
        public async Task<object> GetProfile()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("GetSubcriseToken")]
        public async Task<object> GetSubcriseToken()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("EndOfDay")]
        public async Task<object> EndOfDay()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("KeepAlive")]
        public async Task<object> KeepAlive()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpGet]
        [Route("Logout")]
        public async Task<object> Logout()
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), null, HttpMethod.Get);

            return StatusCode((int)data.Item1, data.Item2);
        }

        [HttpPost]
        [Route("forgotPassword")]
        public async Task<object> forgotPassword([FromBody] ResetPasswordInput requestDto)
        {
            _forwarderService.SetToken(GetTokenFromRequestHeader());

            var data = await _forwarderService.ForwardRequest<object, object>(Request.Path.ToString(), requestDto, HttpMethod.Post);

            return StatusCode((int)data.Item1, data.Item2);
        }
    }
}