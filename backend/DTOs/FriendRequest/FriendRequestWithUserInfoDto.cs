using Google.Cloud.Firestore;

namespace backend.DTOs.FriendRequest
{
    public class FriendRequestWithUserInfoDto
    {
        public string Id { get; set; }

        public string UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public Timestamp CreatedAt { get; set; }

        public string Status { get; set; }

        public string Email { get; set; }

    }
}
