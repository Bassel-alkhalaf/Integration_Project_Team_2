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
            {
                var allUsers = await _userService.GetAllUsersAsync();

                if (string.IsNullOrEmpty(query))
                {
                    return allUsers.Select(user => _userService.ConvertToUserInfoDto(user)).ToList();
                }

                var queryText = query.ToLower();

                var matchedUsers = allUsers
                    .Where(user =>
                        user.Email.Equals(queryText, StringComparison.OrdinalIgnoreCase) ||
                        user.FirstName.Contains(queryText, StringComparison.OrdinalIgnoreCase) || 
                        user.LastName.Contains(queryText, StringComparison.OrdinalIgnoreCase))
                    .Select(user => _userService.ConvertToUserInfoDto(user))
                    .ToList();

                return matchedUsers;
            }
        }
    }

    

}
