using System;

namespace MiniTaskHub.Api.Models;
/// <summary>
/// Standart error response for API errors.
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// Error message.
    /// </summary>
    public string Message { get; set; }=string.Empty;
    /// <summary>
    /// Optional error details.
    /// </summary>
    public string? Details { get; set; }
}
