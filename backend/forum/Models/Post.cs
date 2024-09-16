using System;
using System.Collections.Generic;

namespace forum.Models
{
    public class Post
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsPrivate { get; set; }
        public List<string>? Likes { get; set; } // List of userIds who liked the post
    }
}
