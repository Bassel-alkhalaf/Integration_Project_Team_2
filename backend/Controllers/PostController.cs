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

       [HttpGet("/posts")]
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

        [HttpPost("posts/create")]
        public async Task<ActionResult> CreatePost([FromBody] Post post)
        {
            await _postService.CreatePost(post);
            return Ok();
        }

        [HttpDelete("{postId}")]
        public async Task<ActionResult> DeletePost(string postId)
        {
            await _postService.DeletePost(postId);
            return Ok();
        }
    }
}
