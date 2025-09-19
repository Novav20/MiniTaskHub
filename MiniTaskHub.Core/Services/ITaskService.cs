using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Core.Services;

/// <summary>
/// Defines the contract for a service that manages task items.
/// </summary>
public interface ITaskService
{
    /// <summary>
    /// Retrieves all tasks for a specific user.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <returns>A collection of task items.</returns>
    Task<IEnumerable<TaskItem>> GetAllTasksAsync(string userId);

    /// <summary>
    /// Retrieves a specific task by its ID for a specific user.
    /// </summary>
    /// <param name="id">The ID of the task.</param>
    /// <param name="userId">The ID of the user.</param>
    /// <returns>The task item if found; otherwise, null.</returns>
    Task<TaskItem?> GetTaskByIdAsync(int id, string userId);

    /// <summary>
    /// Creates a new task for a specific user.
    /// </summary>
    /// <param name="task">The task item to create.</param>
    /// <param name="userId">The ID of the user.</param>
    /// <returns>The created task item.</returns>
    Task<TaskItem> CreateTaskAsync(TaskItem task, string userId);

    /// <summary>
    /// Updates an existing task for a specific user.
    /// </summary>
    /// <param name="id">The ID of the task to update.</param>
    /// <param name="task">The updated task item.</param>
    /// <param name="userId">The ID of the user.</param>
    /// <returns>The updated task item if found; otherwise, null.</returns>
    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task, string userId);

    /// <summary>
    /// Deletes a specific task by its ID for a specific user.
    /// </summary>
    /// <param name="id">The ID of the task to delete.</param>
    /// <param name="userId">The ID of the user.</param>
    Task DeleteTaskAsync(int id, string userId);
}
