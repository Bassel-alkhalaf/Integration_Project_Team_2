using forum.Models;
using Firebase.Database;
using Firebase.Database.Query; // Import this to use Firebase queries
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace forum.Services
{
    public class CommentService
    {
        private readonly FirebaseClient _firebaseClient;

        public CommentService(FirebaseClient firebaseClient)
        {
            _firebaseClient = firebaseClient;
        }

        // Fetch comments by post ID
        public async Task<List<Comment>> GetCommentsByPostIdAsync(string postId)
        {
            var comments = await _firebaseClient
                .Child("comments") // Access the "comments" node
                .OrderBy("PostId") // Order by PostId
                .EqualTo(postId)   // Filter where PostId equals the passed postId
                .OnceAsync<Comment>(); // Fetch the filtered comments

            return comments
                .Select(c => c.Object) // Select the comment objects
                .ToList(); // Return the filtered comments as a List
        }

        // Create a new comment
        public async Task CreateCommentAsync(Comment comment)
        {
            await _firebaseClient
                .Child("comments") // Access the "comments" node
                .PostAsync(comment); // Add the comment object to Firebase
        }

        // Delete a comment by its Firebase-generated ID
        public async Task DeleteCommentAsync(string id)
        {
            // Fetch the comment by its Firebase key
            var commentToDelete = await _firebaseClient
                .Child("comments") // Access the "comments" node
                .Child(id) // Access the specific comment by its Firebase key
                .OnceSingleAsync<Comment>(); // Fetch the single comment object

            if (commentToDelete != null)
            {
                // Delete the comment by its Firebase key
                await _firebaseClient
                    .Child("comments")
                    .Child(id) // Use the comment's Firebase key for deletion
                    .DeleteAsync();
            }
        }
    }
}
