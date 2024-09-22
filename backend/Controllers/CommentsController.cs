// Controllers/CommentsController.cs
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentsController(CommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> Get(string id)
        {
            var comment = await _commentService.GetCommentAsync(id);
            if (comment == null) return NotFound();
            return Ok(comment);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> Get()
        {
            var comments = await _commentService.GetAllCommentsAsync();
            return Ok(comments);
        }

        [HttpPost]
        [FirebaseAuth]
        public async Task<ActionResult<Comment>> Post([FromBody] Comment comment)
        {
            await _commentService.AddCommentAsync(comment);
            return CreatedAtAction(nameof(Get), new { id = comment.Id }, comment);
        }

        [HttpPut("{id}")]
        [FirebaseAuth]
        public async Task<ActionResult<Comment>> Put(string id, [FromBody] Comment updatedComment)
        {
            await _commentService.UpdateCommentAsync(id, updatedComment);
            return Ok(updatedComment);
        }

        [HttpDelete("{id}")]
        [FirebaseAuth]
        public async Task<ActionResult> Delete(string id)
        {
            await _commentService.DeleteCommentAsync(id);
            return NoContent();
        }
    }
}
