using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog;

namespace WebApi.Infrastructure.Configurations
{
    public static class LoggerConfiguration
    {
        public static ILoggerFactory AddLoggerFactory(this ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            loggerFactory.AddConsole(configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            loggerFactory.AddSerilog();

            return loggerFactory;
        }
    }
}
