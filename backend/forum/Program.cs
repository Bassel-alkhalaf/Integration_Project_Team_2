using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using forum.Services;
using Firebase.Database;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Load configuration from appsettings.json and environment variables
builder.Configuration.AddJsonFile("appsettings.json").AddEnvironmentVariables();

// Firebase Admin SDK initialization
var firebaseKeyPath = builder.Configuration["Firebase:PrivateKeyPath"]; // Load key path from appsettings
if (!File.Exists(firebaseKeyPath))
{
    throw new FileNotFoundException("Firebase service account key file not found", firebaseKeyPath);
}
var firebaseKey = await File.ReadAllTextAsync(firebaseKeyPath); // Read the key file

FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromJson(firebaseKey) // Initialize Firebase using JSON from the file
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<FirebaseAuthService>(); // Register Firebase Authentication Service
builder.Services.AddSingleton<PostService>(); // Register PostService
builder.Services.AddSingleton<UserService>(); // Register UserService
builder.Services.AddSingleton<CommentService>(); // Register CommentService
builder.Services.AddSingleton<FriendService>(); // Register FriendService

// Add FirebaseClient to the services container
builder.Services.AddSingleton(sp => new FirebaseClient(builder.Configuration["Firebase:DatabaseUrl"])); // Register FirebaseClient using the Database URL from appsettings

// Configure JWT Bearer Authentication using configuration from appsettings.json
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Read the secret key for JWT
        };
    });

// Enable CORS to allow requests from the React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Use development exception page if in development, otherwise use error handling and HSTS in production
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Serve React build files from wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = ""
});

app.UseRouting(); // Enable routing middleware
app.UseCors("AllowAll"); // Apply CORS policy
app.UseAuthentication(); // Enable authentication
app.UseAuthorization();  // Enable authorization

// Map controller routes for API
app.MapControllers();

// Serve React's index.html for any non-API route
app.MapFallbackToFile("index.html");

app.Run();
