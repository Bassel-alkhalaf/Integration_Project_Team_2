using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendRequestController : ControllerBase
    {
        private readonly FriendRequestService _friendRequestService;

        public FriendRequestController(FriendRequestService friendRequestService)
        {
            _friendRequestService = friendRequestService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FriendRequest>> Get(string id)
        {
            var friendRequest = await _friendRequestService.GetFriendRequestAsync(id);
            if (friendRequest == null) return NotFound();
            return Ok(friendRequest);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> Get()
        {
            var friendRequests = await _friendRequestService.GetAllFriendRequestsAsync();
            return Ok(friendRequests);
        }

        [HttpPost]
        public async Task<ActionResult<FriendRequest>> Post([FromBody] FriendRequest friendRequest)
        {
            await _friendRequestService.AddFriendRequestAsync(friendRequest);
            return CreatedAtAction(nameof(Get), new { id = friendRequest.Id }, friendRequest);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FriendRequest>> Put(string id, [FromBody] FriendRequest updatedFriendRequest)
        {
            await _friendRequestService.UpdateFriendRequestAsync(id, updatedFriendRequest);
            return Ok(updatedFriendRequest);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            await _friendRequestService.DeleteFriendRequestAsync(id);
            return NoContent();
        }
    }
}
