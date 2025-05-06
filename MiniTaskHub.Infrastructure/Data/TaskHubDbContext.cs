using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Infrastructure.Data;

public class TaskHubDbContext(DbContextOptions<TaskHubDbContext> options) : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

}
