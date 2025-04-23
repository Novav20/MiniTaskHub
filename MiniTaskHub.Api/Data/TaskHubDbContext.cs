using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Api.Models;

namespace MiniTaskHub.Api.Data;

public class TaskHubDbContext(DbContextOptions<TaskHubDbContext> options): DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

}
