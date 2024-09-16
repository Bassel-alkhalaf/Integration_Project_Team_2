using System;

namespace forum.Models
{
    public class Comment
    {
        public string? Id { get; set; }
        public string? PostId { get; set; }
        public string? AuthorId { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
