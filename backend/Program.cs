using backend.Services;
using backend.Utilities;
using dotenv.net;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotEnv.Load();

// Initialize Firebase
FirebaseConfig.Initialize();

// Register FirestoreDb
builder.Services.AddSingleton(FirebaseConfig.GetFirestoreDb());

// Register services
builder.Services.AddScoped<UserCommunityService>();
builder.Services.AddScoped<CommunityService>();
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<FriendshipService>();
builder.Services.AddScoped<FriendRequestService>();
builder.Services.AddScoped<UserService>(); 
builder.Services.AddScoped<SearchService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<FirebaseAuthService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new TimestampConverter());
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

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
