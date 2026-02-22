using System.Threading.Tasks;
using SpaceX.AuthApi.Entities;

namespace SpaceX.AuthApi.Services.Database
{
    public interface IDatabaseService
    {
       Task<bool> CreateAuthTablesAsync();
       Task<bool> InsertUserAsync(User user);
       Task<User> QueryUsersAsync(string email);
    }
}
