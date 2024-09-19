using Google.Cloud.Firestore;

namespace backend.DTOs.Users
{
    public class UserInfoDto
    {
        public string Id { get; set; }
       
        public string Nickname { get; set; }

        public string Bio { get; set; } 

        public string ProfileImageUrl { get; set; } 

        public string Role { get; set; }   

        public Timestamp CreatedAt { get; set; } 
    }
}
