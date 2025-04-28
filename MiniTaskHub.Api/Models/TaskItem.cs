using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MiniTaskHub.Api.Models.Enums;

namespace MiniTaskHub.Api.Models;

/// <summary>
/// Represents a task item in the MiniTaskHub application.
/// </summary>
public class TaskItem
{
    /// <summary>
    /// The unique identifier for the task.
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// The title of the task.
    /// </summary>
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = default!;

    /// <summary>
    /// The detailed description of the task.
    /// </summary>
    [StringLength(500, MinimumLength = 3)]
    public string? Description { get; set; }

    /// <summary>
    /// The status of the task (Pending, InProgress, Done).
    /// </summary>
    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

    /// <summary>
    /// The due date for the task.
    /// </summary>
    public DateTime DueDate { get; set; }
}
