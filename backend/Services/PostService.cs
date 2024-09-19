using backend.DTOs.Posts;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;

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

        public async Task<List<PostWithUserInfoDto>> GetAllPostsAsync()
        {
            var postsResponse = new List<PostWithUserInfoDto>();
            var query = _firestoreDb.Collection("posts");
            var querySnapshot = await query.GetSnapshotAsync();

            foreach (var documentSnapshot in querySnapshot.Documents)
            {
                var post = documentSnapshot.ConvertTo<Post>();
                var user = await _userService.GetUserAsync(post.UserId);

                postsResponse.Add(new PostWithUserInfoDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    Author = new UserInfoDto
                    {
                        Id = user.Id,
                        Nickname = user.Nickname,
                        Bio = user.Bio,
                        ProfileImageUrl = user.ProfileImageUrl,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt,
                    }
                });
            }

            return postsResponse;
        }
    }
}
