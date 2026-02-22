using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using SpaceX.AuthApi.Entities;
using SpaceX.AuthApi.Models;
using SpaceX.AuthApi.Services.Database;
using System.Security.Claims;
using System.Text;

namespace SpaceX.AuthApi.Services.Authorization
{
    public class AuthService : IAuthService
    {
        private IDatabaseService _databaseService;
        private IConfiguration _configuration;
        
        public AuthService(IConfiguration configuration, IDatabaseService databaseService)
        {
            _configuration = configuration;
            _databaseService = databaseService;
        }

        public async Task<string> LoginAsync(UserDto request)
        {
            var user = await _databaseService.QueryUsersAsync(request.Email);

            if (user == null)
            {
                return "Invalid Email/Password";
            }

            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            {
                return "Invalid Email/Password";
            }

            string token = CreateToken(user);
            return token;
        }

        private string CreateToken(User user)
        {
            string secretKey = _configuration["Jwt:Secret"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email)
                ]),
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:ExpiresMinutes")),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var handler = new JsonWebTokenHandler();

            string token = handler.CreateToken(tokenDescriptor);
            return token;
        }

        public async Task<bool> RegisterAsync(UserDto request)
        {
            var existingUser = await _databaseService.QueryUsersAsync(request.Email);
            if (existingUser != null)
                return false;

            var user = new User(request.FirstName, request.LastName, request.Email);
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);
            user.PasswordHash = hashedPassword;

            var result = await _databaseService.InsertUserAsync(user);
            return result;
        }
    }
}
