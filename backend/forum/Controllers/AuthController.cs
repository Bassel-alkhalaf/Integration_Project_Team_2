using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using forum.Services;
using forum.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FirebaseAuthService _firebaseAuthService;

    public AuthController(FirebaseAuthService firebaseAuthService)
    {
        _firebaseAuthService = firebaseAuthService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var token = await _firebaseAuthService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return Ok(new { token });  // Return JWT token after login
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
    {
        try
        {
            var token = await _firebaseAuthService.RegisterAsync(registerRequest.Email, registerRequest.Password);
            return Ok(new { token });  // Return JWT token after registration
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
