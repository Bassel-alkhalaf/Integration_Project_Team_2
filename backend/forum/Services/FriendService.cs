using forum.Models;
using Firebase.Database;
using Firebase.Database.Query;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace forum.Services
{
    public class FriendService
    {
        private readonly FirebaseClient _firebaseClient;

        public FriendService(FirebaseClient firebaseClient)
        {
            _firebaseClient = firebaseClient;
        }

        // Send a friend request
        public async Task SendFriendRequestAsync(FriendRequest request)
        {
            await _firebaseClient
                .Child("friendRequests")
                .PostAsync(request);
        }

        // Accept a friend request by request ID
        public async Task AcceptFriendRequestAsync(string requestId)
        {
            var request = await _firebaseClient
                .Child("friendRequests")
                .Child(requestId)
                .OnceSingleAsync<FriendRequest>();

            if (request != null)
            {
                // Add the friendship to both users' friend lists
                await _firebaseClient
                    .Child("friends")
                    .Child(request.SenderId)
                    .PostAsync(new { FriendId = request.ReceiverId });

                await _firebaseClient
                    .Child("friends")
                    .Child(request.ReceiverId)
                    .PostAsync(new { FriendId = request.SenderId });

                // Remove the friend request after it's accepted
                await _firebaseClient
                    .Child("friendRequests")
                    .Child(requestId)
                    .DeleteAsync();
            }
        }

        // Reject a friend request by request ID
        public async Task RejectFriendRequestAsync(string requestId)
        {
            await _firebaseClient
                .Child("friendRequests")
                .Child(requestId)
                .DeleteAsync();
        }

        // Get a user's friends by their user ID
        public async Task<List<string>> GetFriendsListAsync(string userId)
        {
            var friends = await _firebaseClient
                .Child("friends")
                .Child(userId)
                .OnceAsync<dynamic>();

            return friends.Select(friend => (string)friend.Object.FriendId).ToList();
        }
    }
}
