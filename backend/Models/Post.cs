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
        public string Title { get; set; }

        [FirestoreProperty]
        public string Text { get; set; }

        [FirestoreProperty]
        public List<string> Images { get; set; }

        [FirestoreProperty]
        public string AuthorName { get; set; }

        [FirestoreProperty]
        public string AuthorImg { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        [FirestoreProperty]
        public DateTime? UpdatedAt { get; set; }

        [FirestoreProperty]
        public int CommentCount { get; set; }

        [FirestoreProperty]
        public int LikeCount { get; set; }

        [FirestoreProperty]
        public int DislikeCount { get; set; }

        [FirestoreProperty]
        public string Visibility { get; set; }  // "public", "private", or "friends"
    }
}
