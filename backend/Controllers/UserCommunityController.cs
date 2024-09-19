using backend.DTOs.UserCommunity;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserCommunityController : ControllerBase
    {
        private readonly UserCommunityService _userCommunityService;

        public UserCommunityController(UserCommunityService userCommunityService)
        {
            _userCommunityService = userCommunityService;
        }

        [HttpGet("userId/{userId}")]
        public async Task<IActionResult> Get(string userId)
        {
            var communities = await _userCommunityService.GetUserCommunitiesAsync(userId);
            if (communities == null) return NotFound();
            return Ok(communities);
        }

        [HttpPost("userId/{userId}/communityId/{communityId}")]
        public async Task<IActionResult> Join(string userId, string communityId)
        {
            try
            {
                await _userCommunityService.JoinCommunityAsync(userId, communityId);
                return Ok(new { message = "join_community_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpDelete("userId/{userId}/communityId/{communityId}")]
        public async Task<IActionResult> Leave(string userId, string communityId)
        {
            try
            {
                await _userCommunityService.LeaveCommunityAsync(userId, communityId);
                return Ok(new { message = "leave_community_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpPatch("userId/{userId}/communityId/{communityId}")]
        public async Task<IActionResult> ToggleIsStarred(string userId, string communityId, [FromBody] UserCommunityUpdateDto updateData)
        {
            try
            {
                bool isStarred = updateData.IsStarred;
                await _userCommunityService.UpdateIsStarredAsync(userId, communityId, isStarred);
                return Ok(new { message = isStarred ? "starred_community_success" : "unStarred_community_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
