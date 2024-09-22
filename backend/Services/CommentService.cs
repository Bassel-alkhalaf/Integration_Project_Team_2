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

        public async Task<Comment> GetCommentAsync(string id)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Comment>();
            }
            return null;
        }

        public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("comments").GetSnapshotAsync();
            var comments = new List<Comment>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                comments.Add(document.ConvertTo<Comment>());
            }

            return comments;
        }

        public async Task AddCommentAsync(Comment comment)
        {
            DocumentReference docRef = _db.Collection("comments").Document(comment.Id);
            await docRef.SetAsync(comment);
        }

        public async Task UpdateCommentAsync(string id, Comment comment)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            await docRef.SetAsync(comment, SetOptions.MergeAll);
        }

        public async Task DeleteCommentAsync(string id)
        {
            DocumentReference docRef = _db.Collection("comments").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
