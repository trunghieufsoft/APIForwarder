using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace WebApi.Infrastructure.Services
{
    public interface IForwarderService
    {
        Task<Tuple<HttpStatusCode, TOutput>> ForwardRequest<TInput, TOutput>(string apiUrl, TInput data, HttpMethod method);
        void SetToken(string token);
    }
}
