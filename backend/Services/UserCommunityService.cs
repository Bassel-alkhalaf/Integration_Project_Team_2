using backend.DTOs.Community;
using backend.DTOs.Posts;
using backend.DTOs.UserCommunity;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class UserCommunityService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly UserService _userService;
        private readonly CommunityService _communityService;

        public UserCommunityService(FirestoreDb firestoreDb,UserService userService, CommunityService communityService)
        {
            _firestoreDb = firestoreDb;
            _userService = userService;
            _communityService = communityService;
        }

        public async Task<List<UserCommunityResponseDto>> GetUserCommunitiesAsync(string userId)
        {
            var res = new List<UserCommunityResponseDto>();

            var userCommunitiesRef = _firestoreDb.Collection("user_communities")
                .WhereEqualTo("UserId", userId);
            var snapshot = await userCommunitiesRef.GetSnapshotAsync();

            foreach (var userCommunitySnapshot in snapshot.Documents)
            {
                var userCommunity = userCommunitySnapshot.ConvertTo<UserCommunity>();
                var community = await _communityService.GetCommunityAsync(userCommunity.CommunityId);

                if (community != null) {
                    res.Add(new UserCommunityResponseDto
                    {
                        Id = community.Id,
                        Name = community.Name,
                        Description = community.Description,
                        UserCount = community.UserCount,
                        CreatedAt = community.CreatedAt,
                        IsStarred = userCommunity.IsStarred,
                    });
                }
            }

            return res
                .OrderByDescending(c => c.IsStarred)
                .ThenBy(c => c.Name)
                .ToList();
        }

        public async Task<UserCommunityResponseDto> JoinCommunityAsync(string userId, string communityId)
        {
            return await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                DocumentReference userCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
                DocumentSnapshot snapshot = await transaction.GetSnapshotAsync(userCommunityRef);

                if (snapshot.Exists)
                {
                    throw new Exception("community_already_joined");
                }

                DocumentReference communityRef = _firestoreDb.Collection("communities").Document(communityId);
                DocumentSnapshot communitySnapshot = await transaction.GetSnapshotAsync(communityRef);
                var community = communitySnapshot.ConvertTo<Community>();
                var currentCount = community.UserCount;

                var timestamp = Timestamp.GetCurrentTimestamp();

                var userCommunity = new UserCommunity
                {
                    Id = $"{userId}_{communityId}",
                    UserId = userId,
                    CommunityId = communityId,
                    IsStarred = false,
                    CreatedAt = timestamp,
                };

                transaction.Set(userCommunityRef, userCommunity);
                transaction.Update(communityRef, "UserCount", currentCount + 1);

                return new UserCommunityResponseDto
                {
                    Id = community.Id,
                    Name = community.Name,
                    Description = community.Description,
                    UserCount = community.UserCount,
                    CreatedAt = community.CreatedAt,
                    IsStarred = userCommunity.IsStarred,
                };
            });
        }

        public async Task LeaveCommunityAsync(string userId, string communityId)
        {
            await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                DocumentReference userCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
                DocumentSnapshot snapshot = await transaction.GetSnapshotAsync(userCommunityRef);

                if (!snapshot.Exists)
                {
                    throw new Exception("community_not_joined");
                }

                var communityRef = _firestoreDb.Collection("communities").Document(communityId);
                var communitySnapshot = await transaction.GetSnapshotAsync(communityRef);
                var currentCount = communitySnapshot.GetValue<int>("UserCount");

                transaction.Delete(userCommunityRef);
                transaction.Update(communityRef, "UserCount", currentCount - 1);
            });
        }

        public async Task UpdateIsStarredAsync(string userId, string communityId, bool isStarred)
        {
            DocumentReference docRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
            await docRef.UpdateAsync("IsStarred", isStarred);
        }
    }
}
