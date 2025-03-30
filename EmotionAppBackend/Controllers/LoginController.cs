using System.Security.Claims;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

public class LoginController : ControllerBase
{
    private readonly UserService _userService;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    public LoginController(
        UserService userService,
        IConfiguration configuration,
        ITokenService tokenService
    )
    {
        _userService = userService;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        // 1. 验证用户凭据
        var user = await _userService.ValidateUser(loginRequest.Email, loginRequest.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        // 2. 创建ClaimsPrincipal（用户身份声明）
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // 角色声明，用户可以有多个角色
            new Claim(ClaimTypes.Role, string.Join(" ", user.Roles)),
            // 可以根据需要添加其他自定义声明
        };

        // 3. 生成 JWT Token
        var token = _tokenService.GenerateToken(claims);

        // 4. 返回 Token 或其他需要的内容
        return Ok(new { Token = token });
        //return (IActionResult)ResultTool.Success(token);
    }
}
