using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Infrastructure.Data;

/// <summary>
/// The database context for the MiniTaskHub application.
/// </summary>
public class TaskHubDbContext(DbContextOptions<TaskHubDbContext> options) : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
{
    /// <summary>
    /// The collection of task items in the database.
    /// </summary>
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

}
