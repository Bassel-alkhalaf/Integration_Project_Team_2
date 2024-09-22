// Services/FriendRequestService.cs
using Google.Cloud.Firestore;
using backend.Models;


namespace backend.Services
{
    public class FriendRequestService
    {
        private readonly FirestoreDb _db;

        public FriendRequestService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<FriendRequest> GetFriendRequestAsync(string id)
        {
            DocumentReference docRef = _db.Collection("friendRequests").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<FriendRequest>();
            }
            return null;
        }

        public async Task<IEnumerable<FriendRequest>> GetFriendRequestsByReceiverIdAsync(string receiverId)
        {
            // Create a query to get friend requests where ReceiverId matches the given receiverId
            Query query = _db.Collection("friendRequests").WhereEqualTo("ReceiverId", receiverId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            var friendRequests = new List<FriendRequest>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                friendRequests.Add(document.ConvertTo<FriendRequest>());
            }

            return friendRequests;
        }

        public async Task<IEnumerable<FriendRequest>> GetAllFriendRequestsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("friendRequests").GetSnapshotAsync();
            var friendRequests = new List<FriendRequest>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                friendRequests.Add(document.ConvertTo<FriendRequest>());
            }

            return friendRequests;
        }

        public async Task AddFriendRequestAsync(FriendRequest friendRequest)
        {
            DocumentReference docRef = _db.Collection("friendRequests").Document(friendRequest.Id);
            await docRef.SetAsync(friendRequest);
        }

        public async Task UpdateFriendRequestAsync(string id, FriendRequest friendRequest)
        {
            DocumentReference docRef = _db.Collection("friendRequests").Document(id);
            await docRef.SetAsync(friendRequest, SetOptions.MergeAll);
        }

        public async Task DeleteFriendRequestAsync(string id)
        {
            DocumentReference docRef = _db.Collection("friendRequests").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
