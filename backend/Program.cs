using backend.Services;
using dotenv.net;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotEnv.Load();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Initialize Firebase
FirebaseConfig.Initialize(); 

// Register FirestoreDb
builder.Services.AddSingleton(FirebaseConfig.GetFirestoreDb());

// Register services
builder.Services.AddSingleton<PostService>();

// Register services
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<FriendService>();
builder.Services.AddScoped<FriendRequestService>();
builder.Services.AddScoped<UserService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
