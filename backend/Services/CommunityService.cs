using backend.DTOs.Community;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class CommunityService
    {
        private readonly FirestoreDb _firestoreDb;

        public CommunityService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task<Community?> GetCommunityAsync(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("communities").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Community>();
            }
            return null;
        }

        public async Task CreateCommunityAsync(string userId, CommunityCreateDto communityCreateData)
        {
            await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                Query query = _firestoreDb.Collection("communities").WhereEqualTo("Name", communityCreateData.Name);
                QuerySnapshot querySnapshot = await query.GetSnapshotAsync();

                if (querySnapshot.Count > 0)
                {
                    throw new Exception("community_name_exists");
                }

                DocumentReference newCommunityRef = _firestoreDb.Collection("communities").Document();
                var newCommunityId = newCommunityRef.Id;

                DocumentReference newUserCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{newCommunityId}");

                var timestamp = Timestamp.GetCurrentTimestamp();

                var newCommunity = new Community
                {
                    Id = newCommunityId,
                    Name = communityCreateData.Name,
                    Description = communityCreateData.Description,
                    UserCount = 1,
                    CreatedAt = timestamp,
                };

                var newUserCommunity = new UserCommunity
                {
                    Id = $"{userId}_{newCommunityId}",
                    UserId = userId,
                    CommunityId = newCommunityId,
                    IsStarred = false,
                    CreatedAt = timestamp,
                };

                transaction.Set(newCommunityRef, newCommunity);
                transaction.Set(newUserCommunityRef, newUserCommunity);
            });
        }

        public async Task UpdateCommunityAsync(string communityId, CommunityUpdateDto communityUpdateData)
        {
            DocumentReference docRef = _firestoreDb.Collection("communities").Document(communityId);
            await docRef.UpdateAsync("Description", communityUpdateData.Description);
        }

        public async Task DeleteCommunityAsync(string communityId)
        {
            DocumentReference docRef = _firestoreDb.Collection("communities").Document(communityId);
            await docRef.DeleteAsync();
        }
    }
}
