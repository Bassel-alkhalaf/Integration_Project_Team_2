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

        public async Task<List<Post>> GetPosts(int limit, int page = 1)
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");
            Query query = postsRef.Limit(limit);

            // Calculate the number of posts to skip based on the page number
            int skipCount = (page - 1) * limit;

            // Fetch all posts, and then skip the required number for pagination
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();
                    posts.Add(post);
                }
            }

            // Skip the required number of posts for pagination
            return posts.Skip(skipCount).Take(limit).ToList();
        }


        public async Task CreatePost(Post post)
        {
            post.postId = Guid.NewGuid().ToString();
            post.createdAt = DateTime.UtcNow;
            post.updatedAt = DateTime.UtcNow;

            DocumentReference docRef = _firestoreDb.Collection("posts").Document(post.postId);
            await docRef.SetAsync(post);
        }

        public async Task DeletePost(string postId)
        {
            DocumentReference docRef = _firestoreDb.Collection("posts").Document(postId);
            await docRef.DeleteAsync();
        }
    }
}
