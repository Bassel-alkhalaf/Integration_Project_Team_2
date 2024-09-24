using backend.DTOs.Community;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class SearchService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly CommunityService _communityService;

        public SearchService (FirestoreDb firestoreDb, CommunityService communityService)
        {
            _firestoreDb = firestoreDb;
            _communityService = communityService;
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
    }
}
