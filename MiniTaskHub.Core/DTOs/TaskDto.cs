using System.ComponentModel.DataAnnotations;
using MiniTaskHub.Core.Models.Enums;

namespace MiniTaskHub.Core.DTOs;

/// <summary>
/// Data transfer object for creating or updating a task.
/// </summary>
public class TaskDto
{
    /// <summary>
    /// The title of the task.
    /// </summary>
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = default!;
    /// <summary>
    /// The detailed description of the task.
    /// </summary>
    [StringLength(500, MinimumLength = 3), DataType(DataType.MultilineText)]
    public string? Description { get; set; }
    /// <summary>
    /// The status of the task (e.g., Pending, InProgress, Done).
    /// </summary>
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;
    /// <summary>
    /// The due date for the task.
    /// </summary>
    [Required]
    public DateTime DueDate { get; set; }
}
