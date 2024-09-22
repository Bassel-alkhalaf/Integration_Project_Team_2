using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [FirebaseAuth]
    public class FriendRequestController : ControllerBase
    {
        private readonly FriendRequestService _friendRequestService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public FriendRequestController(FriendRequestService friendRequestService, FirebaseAuthService firebaseAuthService)
        {
            _friendRequestService = friendRequestService;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FriendRequest>> Get(string id)
        {
            var friendRequest = await _friendRequestService.GetFriendRequestAsync(id);
            if (friendRequest == null) return NotFound();
            return Ok(friendRequest);
        }

        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<FriendRequest>>> Get()
        // {
        //     var friendRequests = await _friendRequestService.GetAllFriendRequestsAsync();
        //     return Ok(friendRequests);
        // }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> Get() // *
        {
            // Get the UID of the authenticated user from FirebaseAuthService
            string receiverId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(receiverId))
            {
                return Unauthorized();
            }

            // Call the service to get friend requests where ReceiverId matches the user's UID
            var friendRequests = await _friendRequestService.GetFriendRequestsByReceiverIdAsync(receiverId);

            return Ok(friendRequests);
        }


        [HttpPost]
        public async Task<ActionResult<FriendRequest>> Post([FromBody] FriendRequest friendRequest) // *
        {
            string senderId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized();
            }

            // Check if the authenticated user's ID matches the SenderId of the friend request
            if (friendRequest.SenderId != senderId)
            {
                return BadRequest("Sender ID does not match the authenticated user.");
            }
            
            await _friendRequestService.AddFriendRequestAsync(friendRequest);
            return CreatedAtAction(nameof(Get), new { id = friendRequest.Id }, friendRequest);
        }

        // [HttpPut("/{action}/{id}")]
        // public async Task<ActionResult<FriendRequest>> Put(string action, string id, [FromBody] FriendRequest updatedFriendRequest)
        // {
        //     await _friendRequestService.UpdateFriendRequestAsync(id, updatedFriendRequest);
        //     return Ok(updatedFriendRequest);
        // }

        [HttpPut("{action}/{id}")]
        public async Task<ActionResult<FriendRequest>> Put(string action, string id, [FromBody] FriendRequest updatedFriendRequest)
        {
            // Get the authenticated user's ID
            string userId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Fetch the existing friend request
            var existingFriendRequest = await _friendRequestService.GetFriendRequestAsync(id);

            if (existingFriendRequest == null)
            {
                return NotFound("Friend request not found.");
            }

            // Check the action and ensure the correct user is performing the action
            switch (action.ToLower())
            {
                case "cancel":
                    // Only the sender can cancel the friend request
                    if (existingFriendRequest.SenderId != userId)
                    {
                        return Unauthorized("Only the sender can cancel the friend request.");
                    }
                    updatedFriendRequest.Status = "Canceled";
                    break;

                case "accept":
                case "reject":
                    // Only the receiver can accept or reject the friend request
                    if (existingFriendRequest.ReceiverId != userId)
                    {
                        return Unauthorized("Only the receiver can accept or reject the friend request.");
                    }
                    updatedFriendRequest.Status = action.ToLower() == "accept" ? "Accepted" : "Rejected";
                    break;

                default:
                    return BadRequest("Invalid action. Valid actions are 'cancel', 'accept', or 'reject'.");
            }

            // Update the friend request status
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
