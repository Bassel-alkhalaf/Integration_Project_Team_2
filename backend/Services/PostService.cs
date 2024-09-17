using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class PostService
    {
        private readonly FirestoreDb _firestoreDb;

        public PostService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task<List<Post>> GetAllPostsAsync()
        {
            var posts = new List<Post>();
            var query = _firestoreDb.Collection("posts");
            var querySnapshot = await query.GetSnapshotAsync();
            foreach (var documentSnapshot in querySnapshot.Documents)
            {
                var post = documentSnapshot.ConvertTo<Post>();
                posts.Add(post);
            }
            return posts;
        }
    }
}
