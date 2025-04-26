using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MiniTaskHub.Api.Models.Enums;

namespace MiniTaskHub.Api.Models;

public class TaskItem
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;
    public DateTime DueDate { get; set; }
}
