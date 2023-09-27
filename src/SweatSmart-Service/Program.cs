using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using SweatSmart_Service.Database;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string dbConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

if (dbConnectionString == null)
{
    Console.WriteLine("Fetching connection string from Azure Key Vault...");
    var keyVaultUrl = "https://sweatsmartdb-cs.vault.azure.net/";
    var client = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());
    dbConnectionString = client.GetSecret("DBConnectionString").Value.Value;
}

builder.Services.AddDbContext<SweatSmartDbContext>(options =>
    options.UseSqlServer(dbConnectionString));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();