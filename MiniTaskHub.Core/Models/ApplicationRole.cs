using Microsoft.AspNetCore.Identity;

namespace MiniTaskHub.Core.Models;

/// <summary>
/// Represents a role in the application, inheriting from IdentityRole.
/// This class can be extended with custom properties for the role.
/// </summary>
public class ApplicationRole: IdentityRole
{

}
