using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using WebApi.Infrastructure.Configurations;
using WebApi.Sockets;

namespace WebApi
{
    public class Startup : IStartup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddJwtAuthentication(_configuration);
            services.AddGzipCompression();
            services.AddCorsConfiguration();
            services.AddApiMvc();
            services.AddSpaConfiguration();

            if (_configuration.GetValue<bool>("ApiConfig:EnableSwagger"))
            {
                services.AddSwaggerDocumentation();
            }

            services.AddApiServices(_configuration);

            return services.BuildServiceProvider();
        }

        public void Configure(IApplicationBuilder app)
        {
            var loggerFactory = app.ApplicationServices.GetService<ILoggerFactory>();
            var env = app.ApplicationServices.GetService<IHostingEnvironment>();

            loggerFactory.AddLoggerFactory(_configuration);
            app.UseJwtAuthentication();
            app.UseGlobalExceptionHandler();
            app.UseGzipCompression();
            app.UseCorsConfiguration();

            var wsOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            };

            app.UseWebSockets(wsOptions);
            app.UseMiddleware<SocketService>();

            app.UseApiMvc();

            if (_configuration.GetValue<bool>("ApiConfig:EnableSwagger"))
            {
                app.UseSwaggerDocumentation();
            }

            app.UseApiSpa(env);
        }
    }
}
