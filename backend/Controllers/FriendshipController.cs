using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendshipController : ControllerBase
    {
        private readonly FriendshipService _friendshipService;

        public FriendshipController(FriendshipService friendshipService)
        {
            _friendshipService = friendshipService;
        }

        [HttpGet("userId/{userId}")]
        public async Task<IActionResult> Get(string userId)
        {
            var friendships = await _friendshipService.GetFriendshipsAsync(userId);
            if (friendships == null) return NotFound();
            return Ok(friendships);
        }

        [HttpGet("userId/{userId}/friendId/{friendId}")]
        public async Task<IActionResult> Get(string userId, string friendId)
        {
            var friendship = await _friendshipService.GetFriendshipAsync(userId, friendId);
            if (friendship == null) return NotFound();
            return Ok(friendship);
        }
    }
}
