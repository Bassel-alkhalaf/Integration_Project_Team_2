using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using System;

namespace forum.Utils
{
    public static class FirebaseAdminHelper
    {
        public static void InitializeFirebaseAdmin()
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile("firebasekey/forumproject-30e73-firebase-adminsdk-8pkoh-2efdb30f41.json")
                });
                Console.WriteLine("Firebase Admin initialized.");
            }
        }
    }
}
