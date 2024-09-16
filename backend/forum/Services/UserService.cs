using forum.Models;
using Firebase.Database;
using Firebase.Database.Query;
using System.Threading.Tasks;

namespace forum.Services
{
    public class UserService
    {
        private readonly FirebaseClient _firebaseClient;

        public UserService(FirebaseClient firebaseClient)
        {
            _firebaseClient = firebaseClient;
        }

        // Get user profile by ID
        public async Task<User> GetUserProfileAsync(string userId)
        {
            return await _firebaseClient
                .Child("users")
                .Child(userId)
                .OnceSingleAsync<User>();
        }

        // Update user profile by ID
        public async Task UpdateUserProfileAsync(string userId, User updatedProfile)
        {
            await _firebaseClient
                .Child("users")
                .Child(userId)
                .PutAsync(updatedProfile);
        }
    }
}
