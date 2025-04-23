using System;
using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Api.Data;
using MiniTaskHub.Api.Models;

namespace MiniTaskHub.Api.Services;

public class TaskService(TaskHubDbContext context) : ITaskService
{
    private readonly TaskHubDbContext _context = context;
    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
    {
        return await _context.Tasks.ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null) return null;

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.Status = updatedTask.Status;
        task.DueDate = updatedTask.DueDate;

        await _context.SaveChangesAsync();
        return task;
    }
    public async Task DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is not null)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }

}
