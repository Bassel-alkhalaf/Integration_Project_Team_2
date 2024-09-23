using Google.Cloud.Firestore;
namespace backend.Models
{

    // Id, SenderId, ReceiverId, CreatedAt, Status("Pending", "Accepted", "Denied", "Canceled")
    [FirestoreData]
    public class FriendRequest
    {
        [FirestoreDocumentId]
        public string Id { get; set; }               // Unique ID for the friend request
        
        [FirestoreProperty]
        public string SenderId { get; set; }         // ID of the user sending the friend request
        
        [FirestoreProperty]
        public string ReceiverId { get; set; }       // ID of the user receiving the friend request
        
        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; }      // The date and time when the friend request was created
        
        [FirestoreProperty]
        public string Status { get; set; }           // Status of the friend request ("Pending", "Accepted", "Denied", "Canceled")
    }
}

