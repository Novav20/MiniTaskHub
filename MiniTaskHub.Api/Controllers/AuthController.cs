using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MiniTaskHub.Core.DTOs;
using MiniTaskHub.Core.Models;
using MiniTaskHub.Core.Services;

namespace MiniTaskHub.Api.Controllers
{
    /// <summary>
    /// Handles user authentication, including registration and login.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService
    ) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly ITokenService _tokenService = tokenService;

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="model">The registration details.</param>
        /// <returns>
        /// HTTP 200 OK if registration is successful,
        /// or HTTP 400 Bad Request if registration fails.
        /// </returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new ErrorResponse { Message = "User creation failed!", Details = result.Errors.ToString() });

            return Ok();
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        /// <param name="model">The login details.</param>
        /// <returns>
        /// HTTP 200 OK with the JWT token if login is successful,
        /// or HTTP 401 Unauthorized if login fails.
        /// </returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
                return Unauthorized(new ErrorResponse { Message = "User not found" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized(new ErrorResponse { Message = "Incorrect email or password" });

            var tokenString = _tokenService.CreateToken(user);
            return Ok(new { token = tokenString });
        }
    }
}
