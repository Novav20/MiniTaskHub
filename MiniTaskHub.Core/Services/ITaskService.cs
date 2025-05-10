using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Core.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync(string userId);
    Task<TaskItem?> GetTaskByIdAsync(int id, string userId);
    Task<TaskItem> CreateTaskAsync(TaskItem task, string userId);
    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task, string userId);
    Task DeleteTaskAsync(int id, string userId);
}
