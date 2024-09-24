using backend.DTOs.Community;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class SearchService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly CommunityService _communityService;
        private readonly UserService _userService;

        public SearchService (FirestoreDb firestoreDb, CommunityService communityService, UserService userService)
        {
            _firestoreDb = firestoreDb;
            _communityService = communityService;
            _userService = userService;
        }

        public async Task<List<CommunityWithUserInfoDto>> SearchCommunitiesAsync(string? query)
        {
            var allCommunities = await _communityService.GetPublicCommunitiesAsync();

            if (string.IsNullOrEmpty(query))
            {
                return allCommunities;
            }

            var queryText = query.ToLower();
            var results = new List<CommunityWithUserInfoDto>();

            foreach (var community in allCommunities)
            {
                if (community.Name.ToLower().Contains(queryText))
                {
                    results.Add(community);
                }
            }

            return results;
        }

        public async Task<List<UserInfoDto>> SearchUsersAsync(string? query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return new List<UserInfoDto>();
            }

            var queryText = query.ToLower();
            QuerySnapshot snapshot = await _firestoreDb.Collection("users").GetSnapshotAsync();
            var users = snapshot.Documents.Select(doc => doc.ConvertTo<User>()).ToList();

            var matchedUsers = users
                .Where(user => user.FirstName.ToLower().Contains(queryText) || user.LastName.ToLower().Contains(queryText))
                .Select(user => new UserInfoDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DOB = user.DOB,
                    Gender = user.Gender,
                    Bio = user.Bio,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                })
                .ToList();

            return matchedUsers;
        }
    }

    

}
