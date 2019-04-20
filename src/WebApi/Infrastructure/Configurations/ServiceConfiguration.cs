using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Security.Authentication;
using Microsoft.Extensions.Configuration;
using WebApi.Infrastructure.Filters;
using WebApi.Infrastructure.Services;

namespace WebApi.Infrastructure.Configurations
{
    public static class ServiceConfiguration
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IAuthorizationHandler, UpdatePermissionFilter>();
            services.AddHttpClient<IForwarderService, ForwarderService>()
                //.AddHttpMessageHandler<LoggingHandler>()
                .ConfigurePrimaryHttpMessageHandler(sp => new HttpClientHandler
                {
                    AllowAutoRedirect = false,
                    ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true,
                    SslProtocols = configuration.GetValue<bool>("ApiConfig:SSLTrustedAlways")
                        ? SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12
                        : SslProtocols.None
                });

            return services;
        }
    }
}
