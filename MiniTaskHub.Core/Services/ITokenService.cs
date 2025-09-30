
using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Core.Services
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user);
    }
}
