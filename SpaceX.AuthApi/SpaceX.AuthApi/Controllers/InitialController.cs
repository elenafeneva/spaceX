using Microsoft.AspNetCore.Mvc;
using SpaceX.AuthApi.Services.Database;

namespace SpaceX.AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InitialController : ControllerBase
    {
        public IConfiguration _configuration;
        public IDatabaseService _databaseService;

        public InitialController(IConfiguration configuration, IDatabaseService databaseService)
        {
            _configuration = configuration;
            _databaseService = databaseService;
        }

        [HttpPost("database")]
        public async Task<ActionResult<bool>> CreateAuthDatabaseAsync(string apiKey)
        {
            if (apiKey != _configuration["ApiKey"])
                return BadRequest("Invalid API Key");

            return await _databaseService.CreateAuthTablesAsync();
        }
    }
}
