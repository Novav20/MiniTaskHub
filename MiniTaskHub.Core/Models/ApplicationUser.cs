using Microsoft.AspNetCore.Identity;

namespace MiniTaskHub.Core.Models;

/// <summary>
/// Represents a user in the application, inheriting from IdentityUser.
/// This class can be extended with custom properties for the user.
/// </summary>
public class ApplicationUser : IdentityUser
{
    // You can add custom properties here if needed in the future
    // public string? FirstName { get; set; }
    // public string? LastName { get; set; }
}
