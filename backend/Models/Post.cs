using Google.Cloud.Firestore;

namespace backend.Models
{
    // Id, UserId(author), Visibility("Public", "Friends", "CloseFriends"), Content, ImageUrls, CreatedAt, UpdatedAt

    [FirestoreData]
    public class Post
    {
        [FirestoreDocumentId]
        public string Id { get; set; }

        [FirestoreProperty]
        public string UserId { get; set; } // ID of the user who created the post

        [FirestoreProperty]
        public string Content { get; set; } // Post content

        [FirestoreProperty]
        public string Visibility { get; set; } // e.g., "Public", "Friends", "CloseFriends"

        [FirestoreProperty]
        public List<string> ImageUrls { get; set; } // List of image URLs associated with the post

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        [FirestoreProperty]
        public DateTime UpdatedAt { get; set; }
    }
}
