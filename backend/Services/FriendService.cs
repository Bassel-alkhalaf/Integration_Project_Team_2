// Services/FriendService.cs
using Google.Cloud.Firestore;
using backend.Models;


namespace backend.Services
{
    public class FriendService
    {
        private readonly FirestoreDb _db;

        public FriendService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<Friend> GetFriendAsync(string userId)
        {
            DocumentReference docRef = _db.Collection("friends").Document(userId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Friend>();
            }
            return null;
        }

        public async Task AddFriendAsync(Friend friend)
        {
            DocumentReference docRef = _db.Collection("friends").Document(friend.UserId);
            await docRef.SetAsync(friend);
        }

        public async Task UpdateFriendAsync(string userId, Friend friend)
        {
            DocumentReference docRef = _db.Collection("friends").Document(userId);
            await docRef.SetAsync(friend, SetOptions.MergeAll);
        }
    }
}
