using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly PostService _postService;

        public PostsController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Post>>> GetPosts([FromQuery] int limit = 4)
        {
            var posts = await _postService.GetAllPosts(limit);
            return Ok(posts);
        }

        [HttpPost]
        public async Task<ActionResult> CreatePost([FromForm] Post post)
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
