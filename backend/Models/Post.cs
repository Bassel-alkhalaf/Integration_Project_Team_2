using Google.Cloud.Firestore;

namespace backend.Models
{
    // Id, UserId(author), Visibility("Public", "Friends", "CloseFriends"), Content, ImageUrls, CreatedAt, UpdatedAt

    [FirestoreData]
    public class Post
    {
        [FirestoreDocumentId]
        public string PostId { get; set; }
        
        [FirestoreProperty]
        public string AuthorId { get; set; }
        
        [FirestoreProperty]
        public string CommunityId { get; set; } // Nullable if not in a community
        
        [FirestoreProperty]
        public string Text { get; set; }
        
        [FirestoreProperty]
        public List<string> Images { get; set; } = new List<string>();
        
        [FirestoreProperty]
        public int CommentsCount { get; set; }
        
        [FirestoreProperty]
        public int LikesCount { get; set; }
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }
        
        [FirestoreProperty]
        public DateTime UpdatedAt { get; set; }
        
        [FirestoreProperty]
        public string Visibility { get; set; } = "Public"; // Default to "Public"
        
        [FirestoreProperty]
        public List<string> Comments { get; set; } = new List<string>();
    }
}
