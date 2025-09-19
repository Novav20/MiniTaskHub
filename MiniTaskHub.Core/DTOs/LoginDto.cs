namespace MiniTaskHub.Core.DTOs;

/// <summary>
/// Data transfer object for user login.
/// </summary>
public class LoginDto
{
    /// <summary>
    /// The user's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;
    /// <summary>
    /// The user's password.
    /// </summary>
    public string Password { get; set; } = string.Empty;
}
