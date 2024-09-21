using Google.Cloud.Firestore;

namespace backend.Models
{
   [FirestoreData]
    public class User
    {
        [FirestoreDocumentId]
        public string UserId { get; set; }
        
        [FirestoreProperty]
        public string Username { get; set; }
        
        [FirestoreProperty]
        public string Email { get; set; }
        
        [FirestoreProperty]
        public string Bio { get; set; }
        
        [FirestoreProperty]
        public string ProfileImageUrl { get; set; }
        
        [FirestoreProperty]
        public string Role { get; set; } = "User"; // Default to "User"
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }
        
        [FirestoreProperty]
        public List<string> FollowingUsers { get; set; } = new List<string>();
        
        [FirestoreProperty]
        public List<string> CommunitiesJoined { get; set; } = new List<string>();
        
        [FirestoreProperty]
        public List<string> PostsCreated { get; set; } = new List<string>();
        
        [FirestoreProperty]
        public List<string> CloseFriends { get; set; } = new List<string>();
        
        [FirestoreProperty]
        public List<string> FriendRequests { get; set; } = new List<string>();
    }
}
