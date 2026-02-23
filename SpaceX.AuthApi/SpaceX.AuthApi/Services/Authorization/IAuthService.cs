using SpaceX.AuthApi.Models;

namespace SpaceX.AuthApi.Services.Authorization
{
    public interface IAuthService
    {
        Task<string> LoginAsync(UserLoginDto request);
        Task<bool> RegisterAsync(UserRegisterDto request);
    }
}
