using Google.Cloud.Firestore;
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class ReportService
    {
        private readonly FirestoreDb _db;

        public ReportService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<Report> GetReportAsync(string id)
        {
            DocumentReference docRef = _db.Collection("reports").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            // if (snapshot.Exists)
            // {
                return snapshot.ConvertTo<Report>();
            // }
            // return null;
        }

        public async Task<List<Report>> GetAllReportsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("reports").GetSnapshotAsync();
            var reports = new List<Report>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                reports.Add(document.ConvertTo<Report>());
            }

            return reports;
        }
        public async Task AddReportAsync(string reporterId, Report report)
        {
            // Automatically set the CreatedAt property
            report.CreatedAt = Timestamp.GetCurrentTimestamp(); // Assuming this method is correctly implemented
            report.ReporterId = reporterId; // Set the reporterId

            // Create a new document reference and generate an ID
            DocumentReference docRef = _db.Collection("reports").Document();

             Console.WriteLine(docRef);

            
            // Set the report ID to the generated document ID
            report.Id = docRef.Id; // Set the generated ID

           
            // Save the report to Firestore
            await docRef.SetAsync(report); // This saves the report to the Firestore
        }



        public async Task DeleteReportAsync(string id)
        {
            DocumentReference docRef = _db.Collection("reports").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
