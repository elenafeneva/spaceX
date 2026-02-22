using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpaceX.AuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceXController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public SpaceXController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [Authorize]
        [HttpGet("{typeOfLaunches}")]
        public async Task<IActionResult> GetSpaceXLatestLaunchesAsync(string typeOfLaunches)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.spacexdata.com/v5/launches/{typeOfLaunches}");

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, "Error calling SpaceX API");

                var content = await response.Content.ReadAsStringAsync();

                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
