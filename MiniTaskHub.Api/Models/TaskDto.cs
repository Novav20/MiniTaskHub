using System.ComponentModel.DataAnnotations;

namespace MiniTaskHub.Api.Models;

public class TaskDto
{
    [Required]
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    [Required]
    public DateTime DueDate { get; set; }
}
