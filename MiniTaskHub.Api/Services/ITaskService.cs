using System;
using MiniTaskHub.Api.Models;

namespace MiniTaskHub.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<TaskItem> CreateTaskAsync(TaskItem task);
    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task);
    Task DeleteTaskAsync(int id);
}
