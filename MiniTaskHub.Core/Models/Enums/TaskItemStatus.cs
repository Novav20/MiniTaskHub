
namespace MiniTaskHub.Core.Models.Enums;

/// <summary>
/// Represents the status of a task item.
/// </summary>
public enum TaskItemStatus
{
    /// <summary>
    /// The task has not been started yet.
    /// </summary>
    Pending,
    /// <summary>
    /// The task is currently being worked on.
    /// </summary>
    InProgress,
    /// <summary>
    /// The task has been completed.
    /// </summary>
    Done
}
