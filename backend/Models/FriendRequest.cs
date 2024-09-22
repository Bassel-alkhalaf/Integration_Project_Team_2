using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class FriendRequest
    {
        [FirestoreDocumentId]
        public string? Id { get; set; }               // This will be automatically set by Firestore
        
        [FirestoreProperty]
        public string SenderId { get; set; }
        
        [FirestoreProperty]
        public string ReceiverId { get; set; }
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }     // Automatically set when creating
        
        [FirestoreProperty]
        public string? Status { get; set; }           // Default to "Pending"
    }
}
