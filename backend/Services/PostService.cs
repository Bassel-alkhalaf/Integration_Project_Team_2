using backend.DTOs.Posts;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;
using Google.Type;

namespace backend.Services
{
    public class PostService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly UserService _userService;

        public PostService(FirestoreDb firestoreDb, UserService userService)
        {
            _firestoreDb = firestoreDb;
            _userService = userService;
        }

        // public async Task<List<PostWithUserInfoDto>> GetAllPostsAsync()
        // {
        //     var postsResponse = new List<PostWithUserInfoDto>();
        //     var query = _firestoreDb.Collection("posts");
        //     var querySnapshot = await query.GetSnapshotAsync();

        //     foreach (var documentSnapshot in querySnapshot.Documents)
        //     {
        //         var post = documentSnapshot.ConvertTo<Post>();
        //         var user = await _userService.GetUserAsync(post.authorId);

        //         postsResponse.Add(new PostWithUserInfoDto
        //         {
        //             Id = post.postId,
        //             Title = post.title,
        //             Content = post.text,
        //             // CreatedAt = post.createdAt.ToDate(),
        //             Author = new UserInfoDto
        //             {
        //                 Id = user.Id,
        //                 FirstName = user.FirstName,
        //                 LastName = user.LastName,
        //                 Bio = user.Bio,
        //                 ProfileImageUrl = user.ProfileImageUrl,
        //                 Role = user.Role,
        //                 CreatedAt = user.CreatedAt,
        //             }
        //         });
        //     }

        //     return postsResponse;
        // }
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
            post.createdAt = System.DateTime.UtcNow;
            post.updatedAt = System.DateTime.UtcNow;

            DocumentReference docRef = _firestoreDb.Collection("posts").Document(post.postId);
            await docRef.SetAsync(post);
        }

        public async Task DeletePost(string postId)
        {
            DocumentReference docRef = _firestoreDb.Collection("posts").Document(postId);
            await docRef.DeleteAsync();
        }

        public async Task<bool> EditPostAsync(string postId, string Title, string Text, string[]? images)
        {
            var postRef = _firestoreDb.Collection("posts").Document(postId);

            var postData = new
            {
                title = Title,
                text = Text,
                images = images ?? [] // Use an empty array if no images are provided
            };

            try
            {
                await postRef.SetAsync(postData, SetOptions.MergeAll);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating post: {ex.Message}");
                return false;
            }
        }

        public async Task<Post> GetPostDetailsAsync(string postId)
        {
            var docRef = _firestoreDb.Collection("posts").Document(postId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Post>();
            }

            return null;
        }


        public async Task<List<Post>> GetPostsByDate(System.DateTime selectedDate) // Specify System.DateTime here
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");

            // Set the range for the selected day (start and end of the day)
            var startOfDay = Timestamp.FromDateTime(selectedDate.Date.ToUniversalTime());
            var endOfDay = Timestamp.FromDateTime(selectedDate.Date.AddDays(1).ToUniversalTime());

            // Query posts that were created between the start and end of the selected day
            Query query = postsRef
                .WhereGreaterThanOrEqualTo("createdAt", startOfDay)
                .WhereLessThan("createdAt", endOfDay);

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

            return posts;
        }

    }
}
