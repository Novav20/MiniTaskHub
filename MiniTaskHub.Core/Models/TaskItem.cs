using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MiniTaskHub.Core.Models.Enums;

namespace MiniTaskHub.Core.Models;

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

    /// <summary>
    /// The foreign key of the user to whom the task is assigned.
    /// </summary>
    [Required]
    public string ApplicationUserId { get; set; } = default!;

    /// <summary>
    /// The user to whom the task is assigned.
    /// </summary>
    [ForeignKey("ApplicationUserId")]
    public virtual ApplicationUser? ApplicationUser { get; set; }
}
