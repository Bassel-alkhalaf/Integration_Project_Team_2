// Controllers/FriendsController.cs
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly FriendService _friendService;

        public FriendsController(FriendService friendService)
        {
            _friendService = friendService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<Friend>> Get(string userId)
        {
            var friend = await _friendService.GetFriendAsync(userId);
            if (friend == null) return NotFound();
            return Ok(friend);
        }

        [HttpPost]
        public async Task<ActionResult<Friend>> Post([FromBody] Friend friend)
        {
            await _friendService.AddFriendAsync(friend);
            return CreatedAtAction(nameof(Get), new { userId = friend.UserId }, friend);
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult<Friend>> Put(string userId, [FromBody] Friend updatedFriend)
        {
            await _friendService.UpdateFriendAsync(userId, updatedFriend);
            return Ok(updatedFriend);
        }
    }
}
