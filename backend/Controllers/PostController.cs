using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class PostsController : ControllerBase
    {
        private readonly PostService _postService;

        public PostsController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts([FromQuery] int limit = 5, [FromQuery] int page = 1)
        {
            try
            {
                var posts = await _postService.GetPosts(limit, page);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                // Handle error
                return StatusCode(500, $"Error fetching posts: {ex.Message}");
            }
        }
        [HttpGet("posts/onlyme")]
        public async Task<IActionResult> GetOnlyMePosts([FromQuery] string userId)
        {
            try
            {
                // Call the service method to get posts with visibility "Only Me" by user
                List<Post> posts = await _postService.GetOnlyMePostsByUser(userId);

                // Return the posts as a JSON response
                return Ok(posts);
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("posts/create")]
        public async Task<ActionResult> CreatePost([FromBody] Post post)
        {
            await _postService.CreatePost(post);
            return Ok();
        }

        [HttpDelete("posts/delete/{postId}")]
        public async Task<ActionResult> DeletePost(string postId)
        {
            await _postService.DeletePost(postId);
            return Ok();
        }


        [HttpPut("posts/{postId}")]
        public async Task<IActionResult> EditPost(string postId, [FromBody] EditPostRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.title) || string.IsNullOrEmpty(request.text))
            {
                return BadRequest("Invalid post data.");
            }
            string[] postImages = request.images ?? Array.Empty<string>();

            bool result = await _postService.EditPostAsync(postId, request.title, request.text, postImages);

            if (result)
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "An error occurred while updating the post.");
        }

        // GET api/posts/{postId}
        [HttpGet("posts/{postId}")]
        public async Task<IActionResult> GetPostDetails(string postId)
        {
            if (string.IsNullOrEmpty(postId))
            {
                return BadRequest("Post ID is required.");
            }

            var post = await _postService.GetPostDetailsAsync(postId);

            if (post == null)
            {
                return NotFound($"Post with ID {postId} was not found.");
            }

            return Ok(post);
        }


        // GET api/posts/by-date
        [HttpGet("posts/by-date")]
        public async Task<IActionResult> GetPostsByDate([FromQuery] System.DateTime date)  // Use System.DateTime explicitly
        {
            try
            {
                var posts = await _postService.GetPostsByDate(date);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching posts: {ex.Message}");
            }
        }

        // Add Like
        [HttpPost("posts/like")]
        public async Task<IActionResult> AddLike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.AddLikeAsync(postId, userId);
            return Ok();
        }

        // Remove Like
        [HttpDelete("posts/like")]
        public async Task<IActionResult> RemoveLike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.RemoveLikeAsync(postId, userId);
            return Ok();
        }

        // Add Dislike
        [HttpPost("posts/dislike")]
        public async Task<IActionResult> AddDislike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.AddDislikeAsync(postId, userId);
            return Ok();
        }

        // Remove Dislike
        [HttpDelete("posts/dislike")]
        public async Task<IActionResult> RemoveDislike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.RemoveDislikeAsync(postId, userId);
            return Ok();
        }

    }
}
