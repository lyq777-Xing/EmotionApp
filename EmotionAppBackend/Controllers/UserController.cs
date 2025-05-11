using EmotionAppBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    /**
     * 段代码是 ASP.NET Core 控制器（Controller） 的 构造函数，
     * 它的作用是 依赖注入（Dependency Injection，DI） UserService，
     * 以便 UserController 可以在方法中使用 UserService 提供的功能。
     */
    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetUsers();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        await _userService.AddUser(user);
        return CreatedAtAction(nameof(GetUsers), new { id = user.UserId }, user);
    }
}