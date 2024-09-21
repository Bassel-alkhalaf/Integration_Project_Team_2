// Services/UserService.cs
using Google.Cloud.Firestore;
using backend.Models;


namespace backend.Services
{
    public class UserService
    {
        private readonly FirestoreDb _db;

        public UserService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<User> GetUserAsync(string id)
        {
            DocumentReference docRef = _db.Collection("users").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<User>();
            }
            return null;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("users").GetSnapshotAsync();
            var users = new List<User>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                users.Add(document.ConvertTo<User>());
            }

            return users;
        }

        public async Task AddUserAsync(User user)
        {
            DocumentReference docRef = _db.Collection("users").Document(user.Id);
            await docRef.SetAsync(user);
        }

        public async Task UpdateUserAsync(string id, User user)
        {
            DocumentReference docRef = _db.Collection("users").Document(id);
            await docRef.SetAsync(user, SetOptions.MergeAll);
        }

        public async Task DeleteUserAsync(string id)
        {
            DocumentReference docRef = _db.Collection("users").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
