using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Xml.Linq; // Added for XML parsing

namespace MiniTaskHub.Infrastructure.Data
{
    public class TaskHubDbContextFactory : IDesignTimeDbContextFactory<TaskHubDbContext>
    {
        public TaskHubDbContext CreateDbContext(string[] args)
        {
            var apiProjectDirectory = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../MiniTaskHub.Api"));
            var apiCsprojPath = Path.Combine(apiProjectDirectory, "MiniTaskHub.Api.csproj");

            string? userSecretsId = null;
            if (File.Exists(apiCsprojPath))
            {
                var doc = XDocument.Load(apiCsprojPath);
                userSecretsId = doc.Descendants("UserSecretsId").FirstOrDefault()?.Value;
            }

            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(apiProjectDirectory)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (environmentName == "Development" && !string.IsNullOrEmpty(userSecretsId))
            {
                configBuilder.AddUserSecrets(userSecretsId);
            }

            var builtConfig = configBuilder.Build();

            var optionsBuilder = new DbContextOptionsBuilder<TaskHubDbContext>();
            var connectionString = builtConfig.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("The connection string 'DefaultConnection' was not found. Make sure it's configured in appsettings.json, appsettings.Development.json, or user secrets.");
            }

            optionsBuilder.UseSqlServer(connectionString);

            return new TaskHubDbContext(optionsBuilder.Options);
        }
    }
}