using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    [Route("ping")]
    public IActionResult Ping()
    {
        return Ok(new { message = "Backend is connected" });
    }
}
