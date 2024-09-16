using forum.Models;
using Firebase.Database;
using Firebase.Database.Query;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace forum.Services
{
    public class PostService
    {
        private readonly FirebaseClient _firebaseClient;

        public PostService(FirebaseClient firebaseClient)
        {
            _firebaseClient = firebaseClient;
        }

        public async Task<List<Post>> GetAllPostsAsync()
        {
            return (await _firebaseClient
                .Child("posts")
                .OnceAsync<Post>())
                .Select(item => item.Object)
                .ToList();
        }

        public async Task<Post> GetPostByIdAsync(string id)
        {
            var post = await _firebaseClient
                .Child("posts")
                .Child(id)
                .OnceSingleAsync<Post>();

            return post;
        }

        public async Task CreatePostAsync(Post post)
        {
            await _firebaseClient
                .Child("posts")
                .PostAsync(post);
        }

        public async Task UpdatePostAsync(string id, Post post)
        {
            await _firebaseClient
                .Child("posts")
                .Child(id)
                .PutAsync(post);
        }

        public async Task DeletePostAsync(string id)
        {
            await _firebaseClient
                .Child("posts")
                .Child(id)
                .DeleteAsync();
        }

        // Like/Unlike a post
        public async Task LikePostAsync(string postId, string userId)
        {
            var post = await GetPostByIdAsync(postId);

            if (post != null)
            {
                // Initialize the list if it's null
                if (post.Likes == null)
                {
                    post.Likes = new List<string>();
                }

                if (post.Likes.Contains(userId))
                {
                    // Unlike the post if the user has already liked it
                    post.Likes.Remove(userId);
                }
                else
                {
                    // Like the post if the user hasn't liked it yet
                    post.Likes.Add(userId);
                }

                await UpdatePostAsync(postId, post);
            }
        }
    }
}
