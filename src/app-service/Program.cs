using System.Text;
using App_Service.Database;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

Console.WriteLine(Environment.GetEnvironmentVariable("SIGNING_KEY"));

// Add services to the container.
builder.Services.AddControllers();

var issuerSigningKey = Environment.GetEnvironmentVariable("SIGNING_KEY");

try
{
    if (issuerSigningKey == null)
    {
        Console.WriteLine("Fetching connection string from Azure Key Vault...");
        var keyVaultUrl = "https://sweatsmartdb-cs.vault.azure.net/";
        var client = new SecretClient(new Uri(keyVaultUrl), new ManagedIdentityCredential());
        issuerSigningKey = client.GetSecret("JWTIssuerSigningKey").Value.Value;
    }
}
catch (Exception e)
{
    Console.WriteLine("Error fetching issuerSigningKey from Azure Key Vault: " + e.Message);
    issuerSigningKey = "";
}

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://sweatsmart-service.azurewebsites.net",
            ValidAudience = "https://sweatsmart-service.azurewebsites.net/api",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(issuerSigningKey))
        };
    });

// Configure Swagger to use JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SweatSmart Service", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

var dbConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

try
{
    if (dbConnectionString == null)
    {
        Console.WriteLine("Fetching connection string from Azure Key Vault...");
        var keyVaultUrl = "https://sweatsmartdb-cs.vault.azure.net/";
        var client = new SecretClient(new Uri(keyVaultUrl), new ManagedIdentityCredential());
        dbConnectionString = client.GetSecret("DBConnectionString").Value.Value;
    }
}
catch (Exception e)
{
    Console.WriteLine("Error fetching connection string from Azure Key Vault: " + e.Message);
    dbConnectionString = "";
}

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(dbConnectionString));

var app = builder.Build();

// Use authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});

app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
