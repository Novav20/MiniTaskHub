using System.ComponentModel.DataAnnotations;
using MiniTaskHub.Core.Models.Enums;

namespace MiniTaskHub.Core.DTOs;

/// <summary>
/// Represents a task item in the MiniTaskHub application. Used on POST method. 
/// </summary>
public class TaskDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = default!;
    [StringLength(500, MinimumLength = 3), DataType(DataType.MultilineText)]
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;
    [Required]
    public DateTime DueDate { get; set; }
}
