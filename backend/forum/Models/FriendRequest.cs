namespace forum.Models
{
    public class FriendRequest
    {
        public string SenderId { get; set; }  // User who sends the request
        public string ReceiverId { get; set; }  // User who receives the request
        public string RequestStatus { get; set; } = "pending";  // Pending, accepted, rejected
    }
}
