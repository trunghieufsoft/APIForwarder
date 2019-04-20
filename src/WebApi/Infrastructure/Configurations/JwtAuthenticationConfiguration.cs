using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using WebApi.Common.Enumerations;
using WebApi.Infrastructure.Filters;

namespace WebApi.Infrastructure.Configurations
{
    public static class JwtAuthenticationConfiguration
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services,
            IConfiguration configuration)
        {
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.ASCII.GetBytes(configuration.GetValue<string>("Jwt:Key"))),
                        ValidAudience = configuration.GetValue<string>("Jwt:Audience"),
                        ValidIssuer = configuration.GetValue<string>("Jwt:Issuer"),
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(0)
                    };
                });

            services.AddAuthorization(auth =>
            {
                var permissions = Enum.GetNames(typeof(PermissionEnum));
                auth.AddPolicy("I2KPolicy", policy =>
                {
                    policy.Requirements.Add(new UpdatePermissionRequirement());
                    policy.RequireRole(permissions);
                });
            });

            return services;
        }

        public static IApplicationBuilder UseJwtAuthentication(this IApplicationBuilder app)
        {
            app.UseAuthentication();

            return app;
        }
    }
}
