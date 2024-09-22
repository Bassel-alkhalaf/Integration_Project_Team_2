using Google.Cloud.Firestore;

namespace backend.Models
{
    // Id, UserId(author), Visibility("Public", "Friends", "CloseFriends"), Content, ImageUrls, CreatedAt, UpdatedAt

    [FirestoreData]
    public class Post
    {
        [FirestoreDocumentId]
        public string postId { get; set; }
        
        [FirestoreProperty]
        public string authorId { get; set; }

        [FirestoreProperty]
        public string title { get; set; }

        [FirestoreProperty]
        public string text { get; set; }

        [FirestoreProperty]
        public List<string> images { get; set; }

        [FirestoreProperty]
        public string authorName { get; set; }

        [FirestoreProperty]
        public string authorImg { get; set; }

        [FirestoreProperty]
        public DateTime createdAt { get; set; }

        [FirestoreProperty]
        public DateTime? updatedAt { get; set; }

        [FirestoreProperty]
        public int commentCount { get; set; }

        [FirestoreProperty]
        public int likeCount { get; set; }

        [FirestoreProperty]
        public int dislikeCount { get; set; }

        [FirestoreProperty]
        public string visibility { get; set; }  // "public", "private", or "friends"
    }
}
