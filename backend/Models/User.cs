using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class User
    {
        [FirestoreDocumentId]
        public string Id { get; set; }               // Unique ID for the user
        
        [FirestoreProperty]
        public string Nickname { get; set; }         // User's nickname
        
        [FirestoreProperty]
        public string Bio { get; set; }              // User's biography or description
        
        [FirestoreProperty]
        public string ProfileImageUrl { get; set; }  // URL to the user's profile image
        
        [FirestoreProperty]
        public string Role { get; set; }             // Role of the user ("Admin", "User")
        
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }      // The date and time when the user was created
    }
}
