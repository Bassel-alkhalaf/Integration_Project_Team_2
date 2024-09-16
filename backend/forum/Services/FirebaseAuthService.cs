using FirebaseAdmin.Auth;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace forum.Services
{
    public class FirebaseAuthService
    {
        private readonly string _jwtSecretKey;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;

        public FirebaseAuthService(IConfiguration configuration)
        {
            _jwtSecretKey = configuration["Jwt:Key"];
            _jwtIssuer = configuration["Jwt:Issuer"];
            _jwtAudience = configuration["Jwt:Audience"];
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            try
            {
                var user = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                return GenerateJwtToken(user.Uid);  // Generate JWT token upon successful login
            }
            catch (Exception ex)
            {
                throw new Exception($"Error logging in: {ex.Message}");
            }
        }

        public async Task<string> RegisterAsync(string email, string password)
        {
            try
            {
                var userRecordArgs = new UserRecordArgs
                {
                    Email = email,
                    Password = password,
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userRecordArgs);
                return GenerateJwtToken(userRecord.Uid);  // Generate JWT token upon successful registration
            }
            catch (Exception ex)
            {
                throw new Exception($"Error registering user: {ex.Message}");
            }
        }

        private string GenerateJwtToken(string userId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwtIssuer,
                audience: _jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
