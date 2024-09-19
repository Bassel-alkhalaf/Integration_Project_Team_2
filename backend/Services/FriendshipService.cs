using Google.Cloud.Firestore;
using backend.Models;


namespace backend.Services
{
    public class FriendshipService
    {
        private readonly FirestoreDb _db;

        public FriendshipService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<Friendship?> GetFriendshipAsync(string userId, string friendId)
        {
            DocumentReference docRef = _db.Collection("friendships").Document($"{userId}_{friendId}");
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Friendship>();
            }
            return null;
        }

        public async Task<List<string>> GetFriendshipsAsync(string userId)
        {
            var friendshipsRef = _db.Collection("friendships")
                .WhereEqualTo("UserId", userId);
            var snapshot = await friendshipsRef.GetSnapshotAsync();

            return snapshot.Documents
                .Select(d => d.GetValue<string>("FriendId"))
                .ToList();
        }

        public async Task AddFriendAsync(string userId, string friendId)
        {
            await _db.RunTransactionAsync(async transaction =>
            {
                DocumentReference userFriendDoc = _db.Collection("friendships").Document($"{userId}_{friendId}");
                DocumentReference friendUserDoc = _db.Collection("friendships").Document($"{friendId}_{userId}");

                DocumentSnapshot userFriendSnapshot = await transaction.GetSnapshotAsync(userFriendDoc);
                DocumentSnapshot friendUserSnapshot = await transaction.GetSnapshotAsync(friendUserDoc);

                if (userFriendSnapshot.Exists || friendUserSnapshot.Exists)
                {
                    throw new Exception("friendship_exists");
                }

                var timestamp = Timestamp.GetCurrentTimestamp();

                var userFriend = new Friendship
                {
                    UserId = userId,
                    FriendId = friendId,
                    IsCloseFriend = false,
                    CreatedAt = timestamp
                };
                transaction.Set(userFriendDoc, userFriend);

                var friendUser = new Friendship
                {
                    UserId = friendId,
                    FriendId = userId,
                    IsCloseFriend = false,
                    CreatedAt = timestamp
                };
                transaction.Set(friendUserDoc, friendUser);
            });
        }

        public async Task UpdateIsCloseFriendAsync(string userId, string friendId, bool isCloseFriend)
        {
            DocumentReference docRef = _db.Collection("friendships").Document($"{userId}_{friendId}");
            await docRef.UpdateAsync("IsCloseFriend", isCloseFriend);
        }

        public async Task RemoveFriendAsync(string userId, string friendId)
        {
            var batch = _db.StartBatch();

            DocumentReference userFriendRef = _db.Collection("friendships").Document($"{userId}_{friendId}");
            DocumentReference friendUserRef = _db.Collection("friendships").Document($"{friendId}_{userId}");

            batch.Delete(userFriendRef);
            batch.Delete(friendUserRef);

            try
            {
                await batch.CommitAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
