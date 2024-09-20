using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class SearchService
    {
        private readonly FirestoreDb _firestoreDb;

        public SearchService (FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        public async Task<List<Community>> SearchCommunitiesAsync(string? query)
        {
            Query communitiesQuery = _firestoreDb.Collection("communities");
            QuerySnapshot snapshot = await communitiesQuery.GetSnapshotAsync();

            if (string.IsNullOrEmpty(query))
            {
                return snapshot.Documents
                               .Select(doc => doc.ConvertTo<Community>())
                               .ToList();
            }

            var queryText = query.ToLower();
            List<Community> communities = new List<Community>();

            foreach (DocumentSnapshot doc in snapshot.Documents)
            {
                var community = doc.ConvertTo<Community>();

                if (community.Name.ToLower().Contains(queryText))
                {
                    communities.Add(community);
                }
            }

            return communities;
        }
    }
}
