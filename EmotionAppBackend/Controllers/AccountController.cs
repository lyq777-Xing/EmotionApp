using System.Security.Claims;
using EmotionAppBackend.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

[Route("api/account")] // 添加路由属性
[ApiController] // 添加API控制器属性
public class AccountController : ControllerBase
{
    private readonly UserService _userService;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;
    private readonly RoleService _roleService;

    public AccountController(
        UserService userService,
        IConfiguration configuration,
        ITokenService tokenService,
        RoleService roleService
    )
    {
        _userService = userService;
        _configuration = configuration;
        _tokenService = tokenService;
        _roleService = roleService;
    }

    /**
     * 登录
     */
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        // 1. 验证用户凭据
        var user = await _userService.ValidateUser(loginRequest.Email, loginRequest.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        // 输出用户角色信息进行调试
        Console.WriteLine($"User roles: {string.Join(", ", user.Roles.Select(r => r.RoleName))}");

        // 2. 创建ClaimsPrincipal（用户身份声明）
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // 角色声明，用户可以有多个角色
            //new Claim(ClaimTypes.Role, string.Join(" ", user.Roles)),
            // 可以根据需要添加其他自定义声明
        };
        // 为每个角色添加单独的 Claim
        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role.RoleName)));

        // 3. 生成 JWT Token
        var token = _tokenService.GenerateToken(claims);

        // 4. 返回 Token 或其他需要的内容
        return Ok(new { Token = token });
        //return (IActionResult)ResultTool.Success(token);
    }

    /**
     * 注册
     */
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        //验证用户的信息
        var getByEmail = _userService.GetUserByEmail(user.Email);
        if (getByEmail.Result != null)
        {
            return BadRequest("该邮箱已被注册");
        }
        try
        {
            //user.Password = user.Password.Md5String();
            //user.CreatedAt = DateTime.Now;

            //设置默认角色
            var role = await _roleService.GetRoleByName("user");
            user.Roles = new List<Role> { role };

            await _userService.AddUser(user);
            return Ok("注册成功");
        }
        catch (Exception ex)
        {
            return BadRequest("注册失败");
        }
    }

    /**
     * 获取当前用户信息
     */
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentUser()
    {
        // 获取当前用户的 ID
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
        {
            return Unauthorized("User not authenticated.");
        }

        // 将字符串 userId 转换为整数
        if (!int.TryParse(userIdString, out var userId))
        {
            return BadRequest("Invalid user ID format.");
        }

        // 根据 ID 获取用户信息
        var user = await _userService.GetUserById(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        return Ok(user);
    }
}
