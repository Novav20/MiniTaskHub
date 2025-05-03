using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Infrastructure.Data;

public class TaskHubDbContext(DbContextOptions<TaskHubDbContext> options): DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

}
