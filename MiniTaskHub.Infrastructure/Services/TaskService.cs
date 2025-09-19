using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Infrastructure.Data;
using MiniTaskHub.Core.Models;
using MiniTaskHub.Core.Services;

namespace MiniTaskHub.Infrastructure.Services;

/// <summary>
/// Provides services for managing task items.
/// </summary>
public class TaskService(TaskHubDbContext context) : ITaskService
{
    private readonly TaskHubDbContext _context = context;
    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync(string userId)
    {
        return await _context.Tasks
            .Where(t => t.ApplicationUserId == userId)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id, string userId)
    {
        return await _context.Tasks
            .FirstOrDefaultAsync(t => t.ApplicationUserId == userId && t.Id == id);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem task, string userId)
    {
        task.ApplicationUserId = userId;
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask, string userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.ApplicationUserId == userId);
        if (task is null) return null;

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.Status = updatedTask.Status;
        task.DueDate = updatedTask.DueDate;

        await _context.SaveChangesAsync();
        return task;
    }
    public async Task DeleteTaskAsync(int id, string userId)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.ApplicationUserId == userId);
        if (task is not null)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }

}
