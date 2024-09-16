namespace forum.Models
{
    public class User
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public string? Age { get; set; }
        public string? Hobbies { get; set; }
        public string? Interests { get; set; }
        public string? Bio { get; set; }  // New bio field
    }
}
