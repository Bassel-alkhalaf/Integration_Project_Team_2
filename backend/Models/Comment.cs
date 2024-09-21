using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class Comment
    {
        [FirestoreDocumentId]
        public string CommentId { get; set; }
        
        [FirestoreProperty]
        public string PostId { get; set; }
        
        [FirestoreProperty]
        public string AuthorId { get; set; }
        
        [FirestoreProperty]
        public string Text { get; set; }
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }
    }
}
