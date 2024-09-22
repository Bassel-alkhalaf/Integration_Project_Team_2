using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [FirebaseAuth]
    public class FriendshipController : ControllerBase
    {
        private readonly FriendshipService _friendshipService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public FriendshipController(FriendshipService friendshipService, FirebaseAuthService firebaseAuthService)
        {
            _friendshipService = friendshipService;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpGet()]
        public async Task<IActionResult> Get()
        {
            var userId = _firebaseAuthService.GetUserId();

            var friendships = await _friendshipService.GetFriendshipsAsync(userId);
            if (friendships == null) return NotFound();
            return Ok(friendships);
        }

        [HttpGet("friendId/{friendId}")]
        public async Task<IActionResult> Get(string friendId)
        {
            var userId = _firebaseAuthService.GetUserId();

            var friendship = await _friendshipService.GetFriendshipAsync(userId, friendId);
            if (friendship == null) return NotFound();
            return Ok(friendship);
        }
    }
}
