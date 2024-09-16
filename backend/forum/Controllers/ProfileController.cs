using Microsoft.AspNetCore.Mvc;
using forum.Services;
using forum.Models;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly UserService _userService;

    public ProfileController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserProfile(string userId)
    {
        try
        {
            var userProfile = await _userService.GetUserProfileAsync(userId);
            if (userProfile != null)
            {
                return Ok(userProfile);
            }
            return NotFound(new { message = "User profile not found" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody] User updatedProfile)
    {
        try
        {
            await _userService.UpdateUserProfileAsync(userId, updatedProfile);
            return Ok(new { message = "User profile updated successfully" });
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
