using backend.Middlewares;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController (SearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet("communities")]
        public async Task<IActionResult> Search([FromQuery] string? q)
        {
            try
            {
                var communities = await _searchService.SearchCommunitiesAsync(q);
                return Ok(communities);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string? q)
        {
            try
            {
                var users = await _searchService.SearchUsersAsync(q);
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
