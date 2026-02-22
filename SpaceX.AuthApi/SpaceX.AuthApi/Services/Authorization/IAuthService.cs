using SpaceX.AuthApi.Models;

namespace SpaceX.AuthApi.Services.Authorization
{
    public interface IAuthService
    {
        Task<string> LoginAsync(UserDto request);
        Task<bool> RegisterAsync(UserDto request);
    }
}
