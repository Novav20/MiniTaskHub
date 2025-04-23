using System;
using System.ComponentModel.DataAnnotations;

namespace MiniTaskHub.Api.Models;

public class TaskItem
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    [Required]
    public string Status { get; set; } = "Pending";
    public DateTime DueDate { get; set; }
}
