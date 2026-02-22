using MySqlConnector;
using SpaceX.AuthApi.Entities;

namespace SpaceX.AuthApi.Services.Database
{
    public class DatabaseService : IDatabaseService
    {
        public IConfiguration _configuration;

        public DatabaseService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> CreateAuthTablesAsync()
        {
            string query = @"
        CREATE TABLE IF NOT EXISTS Users (
            Id CHAR(36) PRIMARY KEY,
            FirstName VARCHAR(100) NOT NULL,
            LastName VARCHAR(100) NOT NULL,
            Email VARCHAR(255) NOT NULL UNIQUE,
            PasswordHash VARCHAR(500) NOT NULL,
            CreatedOnUtc DATETIME DEFAULT CURRENT_TIMESTAMP,
            LastModifiedOnUtc DATETIME DEFAULT CURRENT_TIMESTAMP
        );";
            try
            {
                using var connection = new MySqlConnection(_configuration["ConnectionString"]);
                using var command = new MySqlCommand(query, connection);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> InsertUserAsync(User user)
        {
            var query = @"
        INSERT INTO Users 
        (Id, FirstName, LastName, Email, PasswordHash, CreatedOnUtc)
        VALUES
        (@Id, @FirstName, @LastName, @Email, @PasswordHash, UTC_TIMESTAMP());";

            using var connection = new MySqlConnection(_configuration["ConnectionString"]);
            using var command = new MySqlCommand(query, connection);

            command.Parameters.AddWithValue("@Id", user.Id);
            command.Parameters.AddWithValue("@FirstName", user.FirstName);
            command.Parameters.AddWithValue("@LastName", user.LastName);
            command.Parameters.AddWithValue("@Email", user.Email);
            command.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
            try
            {
                await connection.OpenAsync();
                return await command.ExecuteNonQueryAsync() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<User> QueryUsersAsync(string email)
        {
            var sql = @"
        SELECT Id, FirstName, LastName, Email, PasswordHash, CreatedOnUtc
        FROM Users
        WHERE Email = @Email
        LIMIT 1;
    ";

            using var connection = new MySqlConnection(_configuration["ConnectionString"]);
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@Email", email);

            try
            {
                await connection.OpenAsync();
                using var reader = await command.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                    return null;

                return new User
                {
                    Id = reader.GetGuid("Id"),
                    FirstName = reader.GetString("FirstName"),
                    LastName = reader.GetString("LastName"),
                    Email = reader.GetString("Email"),
                    PasswordHash = reader.GetString("PasswordHash"),
                    CreatedOnUtc = reader.GetDateTime("CreatedOnUtc")
                };
            }
            catch(Exception ex)
            {
                return null;
            }
        }
    }
}
