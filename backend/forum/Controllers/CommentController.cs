using Microsoft.AspNetCore.Mvc;
using forum.Services;
using forum.Models;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _commentService;

    public CommentController(CommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("{postId}")]
    public async Task<IActionResult> GetCommentsByPost(string postId)
    {
        var comments = await _commentService.GetCommentsByPostIdAsync(postId);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment([FromBody] Comment comment)
    {
        await _commentService.CreateCommentAsync(comment);
        return Ok(new { message = "Comment added successfully!" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(string id)
    {
        await _commentService.DeleteCommentAsync(id);
        return Ok(new { message = "Comment deleted successfully!" });
    }
}
