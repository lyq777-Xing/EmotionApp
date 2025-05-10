// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.IdentityModel.Tokens;

// [Route("api/auth")]
// [ApiController]
// public class AuthController : ControllerBase
// {
//     private readonly IConfiguration _configuration;

//     public AuthController(IConfiguration configuration)
//     {
//         _configuration = configuration;
//     }

//     [HttpPost("login")]
//     public IActionResult Login([FromBody] LoginModel model)
//     {
//         if (model.Username == "admin" && model.Password == "123456")
//         {
//             var token = GenerateJwtToken(model.Username, "Admin");
//             return Ok(new { Token = token });
//         }
//         else if (model.Username == "user" && model.Password == "123456")
//         {
//             var token = GenerateJwtToken(model.Username, "user");
//             return Ok(new { Token = token });
//         }

//         return Unauthorized();
//     }

//     private string GenerateJwtToken(string username, string role)
//     {
//         var jwtSettings = _configuration.GetSection("JwtSettings");
//         var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

//         var claims = new[]
//         {
//             new Claim(JwtRegisteredClaimNames.Sub, username),
//             new Claim(ClaimTypes.Name, username),
//             new Claim(ClaimTypes.Role, role),
//             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//         };

//         var token = new JwtSecurityToken(
//             issuer: jwtSettings["Issuer"],
//             audience: jwtSettings["Audience"],
//             claims: claims,
//             expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
//             signingCredentials: new SigningCredentials(
//                 new SymmetricSecurityKey(key),
//                 SecurityAlgorithms.HmacSha256
//             )
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }
// }

// // 登录模型
// public class LoginModel
// {
//     public required string Username { get; set; }
//     public required string Password { get; set; }
// }
