using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/protected")]
[ApiController]
public class ProtectedController : ControllerBase
{
    [Authorize(Roles = "user")]
    //[Authorize(Policy = "UserOnly")]
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
