using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class Friend
    {
        [FirestoreDocumentId]
        public string UserId { get; set; }           // ID of the user who has the friend list
        
        [FirestoreProperty]
        public List<string> FriendIds { get; set; }  // List of user IDs that are friends
        
        [FirestoreProperty]
        public List<string> CloseFriendIds { get; set; } // List of user IDs that are close friends
    }
}
