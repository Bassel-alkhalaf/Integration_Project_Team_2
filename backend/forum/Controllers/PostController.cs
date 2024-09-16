using Microsoft.AspNetCore.Mvc;
using forum.Services;
using forum.Models;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _postService;

    public PostController(PostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPosts()
    {
        var posts = await _postService.GetAllPostsAsync();
        return Ok(posts);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] Post post)
    {
        await _postService.CreatePostAsync(post);
        return Ok(new { message = "Post created successfully!" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(string id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }
        return Ok(post);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(string id, [FromBody] Post post)
    {
        await _postService.UpdatePostAsync(id, post);
        return Ok(new { message = "Post updated successfully!" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(string id)
    {
        await _postService.DeletePostAsync(id);
        return Ok(new { message = "Post deleted successfully!" });
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikePost(string id, [FromBody] string userId)
    {
        await _postService.LikePostAsync(id, userId);
        return Ok(new { message = "Post liked/unliked successfully!" });
    }
}
