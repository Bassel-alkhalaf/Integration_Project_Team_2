using Google.Cloud.Firestore;
namespace backend.Models
{
    // Id, SenderId, ReceiverId, CreatedAt, Status("Pending", "Accepted", "Denied", "Canceled")
    [FirestoreData]
    public class FriendRequest
    {
        [FirestoreDocumentId]
        public string FriendRequestId { get; set; }
        
        [FirestoreProperty]
        public string SenderId { get; set; }
        
        [FirestoreProperty]
        public string ReceiverId { get; set; }
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }
        
        [FirestoreProperty]
        public string Status { get; set; } = "Pending"; // Default to "Pending"
    }
}

