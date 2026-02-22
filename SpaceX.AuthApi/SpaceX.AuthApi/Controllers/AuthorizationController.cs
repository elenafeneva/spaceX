using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceX.AuthApi.Entities;
using SpaceX.AuthApi.Models;
using SpaceX.AuthApi.Services.Authorization;

namespace SpaceX.AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        public IAuthService _authService;

        public AuthorizationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterAsync(UserDto request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result)
                return BadRequest("Email already exists");

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var result = await _authService.LoginAsync(request);
            if (result.Equals("Invalid Email/Password"))
                return BadRequest(result);

            return Ok(result);
        }
    }
}
