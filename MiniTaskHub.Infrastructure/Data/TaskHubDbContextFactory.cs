using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MiniTaskHub.Infrastructure.Data
{
    public class TaskHubDbContextFactory : IDesignTimeDbContextFactory<TaskHubDbContext>
    {
        public TaskHubDbContext CreateDbContext(string[] args)
        {
            // Go up to the API project directory
            var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../MiniTaskHub.Api"));
            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TaskHubDbContext>();
            var connectionString = config.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString);

            return new TaskHubDbContext(optionsBuilder.Options);
        }
    }
}