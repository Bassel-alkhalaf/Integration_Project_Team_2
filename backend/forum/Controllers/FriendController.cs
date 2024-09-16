using Microsoft.AspNetCore.Mvc;
using forum.Services;
using forum.Models;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class FriendController : ControllerBase
{
    private readonly FriendService _friendService;

    public FriendController(FriendService friendService)
    {
        _friendService = friendService;
    }

    [HttpPost("send-request")]
    public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequest request)
    {
        try
        {
            await _friendService.SendFriendRequestAsync(request);
            return Ok(new { message = "Friend request sent!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("accept-request/{requestId}")]
    public async Task<IActionResult> AcceptFriendRequest(string requestId)
    {
        try
        {
            await _friendService.AcceptFriendRequestAsync(requestId);
            return Ok(new { message = "Friend request accepted!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("reject-request/{requestId}")]
    public async Task<IActionResult> RejectFriendRequest(string requestId)
    {
        try
        {
            await _friendService.RejectFriendRequestAsync(requestId);
            return Ok(new { message = "Friend request rejected!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{userId}/friends")]
    public async Task<IActionResult> GetFriends(string userId)
    {
        try
        {
            var friends = await _friendService.GetFriendsListAsync(userId);
            return Ok(friends);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
