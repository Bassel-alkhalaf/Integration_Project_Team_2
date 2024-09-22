using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        // Route: GET /api/friendrequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FriendRequest>> GetFriendRequestById(string id)
        {
            var friendRequest = await _friendRequestService.GetFriendRequestAsync(id);
            if (friendRequest == null) return NotFound();
            return Ok(friendRequest);
        }

        // Route: GET /api/friendrequest/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> GetAllFriendRequests()
        {
            var friendRequests = await _friendRequestService.GetAllFriendRequestsAsync();
            return Ok(friendRequests);
        }

        // Route: GET /api/friendrequest/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> GetUserFriendRequests()
        {
            string receiverId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(receiverId))
            {
                return Unauthorized();
            }

            var friendRequests = await _friendRequestService.GetFriendRequestsByReceiverIdAsync(receiverId);
            return Ok(friendRequests);
        }

        [HttpPost]
        public async Task<ActionResult<FriendRequest>> Post([FromBody] FriendRequest friendRequest)
        {
            string senderId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized();
            }

            if (friendRequest.SenderId != senderId)
            {
                return BadRequest("Sender ID does not match the authenticated user.");
            }

            friendRequest.Status ??= "Pending";
            friendRequest.CreatedAt = DateTime.UtcNow;

            await _friendRequestService.AddFriendRequestAsync(friendRequest);
            return CreatedAtAction(nameof(GetFriendRequestById), new { id = friendRequest.Id }, friendRequest);
        }

        // Route: PUT /api/friendrequest/cancel/{id}
        [HttpPut("cancel/{id}")]
        public async Task<ActionResult<FriendRequest>> Cancel(string id)
        {
            return await HandleFriendRequestAction("cancel", id);
        }

        // Route: PUT /api/friendrequest/accept/{id}
        [HttpPut("accept/{id}")]
        public async Task<ActionResult<FriendRequest>> Accept(string id)
        {
            return await HandleFriendRequestAction("accept", id);
        }

        // Route: PUT /api/friendrequest/reject/{id}
        [HttpPut("reject/{id}")]
        public async Task<ActionResult<FriendRequest>> Reject(string id)
        {
            return await HandleFriendRequestAction("reject", id);
        }

        // Route: DELETE /api/friendrequest/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            string userId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var existingFriendRequest = await _friendRequestService.GetFriendRequestAsync(id);

            if (existingFriendRequest == null)
            {
                return NotFound("Friend request not found.");
            }

            if (existingFriendRequest.SenderId != userId)
            {
                return Unauthorized("Only the sender can delete the friend request.");
            }

            await _friendRequestService.DeleteFriendRequestAsync(id);
            return NoContent();
        }

        private async Task<ActionResult<FriendRequest>> HandleFriendRequestAction(string action, string id)
        {
            string userId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var existingFriendRequest = await _friendRequestService.GetFriendRequestAsync(id);

            if (existingFriendRequest == null)
            {
                return NotFound("Friend request not found.");
            }

            switch (action.ToLower())
            {
                case "cancel":
                    if (existingFriendRequest.SenderId != userId)
                    {
                        return Unauthorized("Only the sender can cancel the friend request.");
                    }
                    existingFriendRequest.Status = "Canceled";
                    break;

                case "accept":
                    if (existingFriendRequest.ReceiverId != userId)
                    {
                        return Unauthorized("Only the receiver can accept the friend request.");
                    }
                    existingFriendRequest.Status = "Accepted";
                    break;

                case "reject":
                    if (existingFriendRequest.ReceiverId != userId)
                    {
                        return Unauthorized("Only the receiver can reject the friend request.");
                    }
                    existingFriendRequest.Status = "Rejected";
                    break;

                default:
                    return BadRequest("Invalid action.");
            }

            await _friendRequestService.UpdateFriendRequestAsync(id, existingFriendRequest);
            return Ok(existingFriendRequest);
        }
    }
}
