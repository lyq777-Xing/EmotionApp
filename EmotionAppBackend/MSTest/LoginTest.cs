using System.Security.Claims;
using EmotionAppBackend.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class LoginTest
{
    //注入userservice实例
    private UserService _userService;
    private ITokenService _tokenService;

    //public LoginTest(UserService userService, ITokenService tokenService)
    //{
    //    _userService = userService;
    //    _tokenService = tokenService;
    //}

    [TestInitialize]
    public void Setup()
    {
        var dbContext = new EmotionAppContext(); // Replace with test database context
        var userRepository = new UserRepository(dbContext);
        _userService = new UserService(userRepository);

        // Fix for CS7036: Pass a valid IConfiguration instance to TokenService
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json") // Load configuration from appsettings.json
            .Build();
        _tokenService = new TokenService(configuration);
    }

    [TestMethod]
    public async Task LoginTask()
    {
        // Define and initialize the loginRequest object to fix CS0103
        var loginRequest = new
        {
            Email = "shehching9@gmail.com", // Replace with appropriate test email
            Password = "123456", // Replace with appropriate test password
        };

        // 1. Validate user credentials
        var user = await _userService.ValidateUser(loginRequest.Email, loginRequest.Password);
        if (user == null)
        {
            Console.WriteLine("Invalid credentials");
        }

        // 2. Create ClaimsPrincipal (user identity claims)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // Role claims, user can have multiple roles
            new Claim(ClaimTypes.Role, string.Join(" ", user.Roles)),
            // Add other custom claims as needed
        };

        // 3. Generate JWT Token
        var token = _tokenService.GenerateToken(claims);

        // 4. Return Token or other required content
        Console.WriteLine(token);
        Console.WriteLine(user.Roles.Count);
        Console.WriteLine("Login successful");
    }
}
