
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/protected")]
[ApiController]
public class ProtectedController : ControllerBase
{
    [Authorize]
    [HttpGet("user")]
    public IActionResult GetUserContent()
    {
        return Ok("This is user content");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult GetAdminContent()
    {
        return Ok("This is admin content");
    }
}