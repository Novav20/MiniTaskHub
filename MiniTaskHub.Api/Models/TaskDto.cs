using System.ComponentModel.DataAnnotations;
using MiniTaskHub.Api.Models.Enums;

namespace MiniTaskHub.Api.Models;

public class TaskDto
{
    [Required]
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;
    [Required]
    public DateTime DueDate { get; set; }
}
