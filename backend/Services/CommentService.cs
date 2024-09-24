using Google.Cloud.Firestore;
using backend.Models;

namespace backend.Services
{
    public class CommentService
    {
        private readonly FirestoreDb _db;

        public CommentService(FirestoreDb config)
        {
            _db = config;
        }

        // Get a specific comment by its ID
        public async Task<Comment?> GetCommentAsync(string id)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            return snapshot.Exists ? snapshot.ConvertTo<Comment>() : null;
        }

        // Get all comments
        public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("comments").GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<Comment>()).ToList();
        }

        // Get comments by PostId
        public async Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(string postId)
        {
            Query query = _db.Collection("comments").WhereEqualTo("PostId", postId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<Comment>()).ToList();
        }

        // Add a new comment
        public async Task AddCommentAsync(Comment comment)
        {
            DocumentReference docRef = _db.Collection("comments").Document(comment.Id);
            await docRef.SetAsync(comment);
        }

        // Update an existing comment
        public async Task UpdateCommentAsync(string id, Comment comment)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            await docRef.SetAsync(comment, SetOptions.MergeAll);
        }

        // Delete a comment by its ID
        public async Task DeleteCommentAsync(string id)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
