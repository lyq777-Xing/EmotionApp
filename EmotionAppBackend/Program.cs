using System;
using System.Text;
using EmotionAppBackend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 获取 JWT 配置
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

// 添加 JWT 鉴权
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
        };
    });

/*    在以下代码中，将调用 AddAuthorizationBuilder，这会：
        将与授权相关的服务添加到 DI 容器。
        返回一个 AuthorizationBuilder，它可用于直接注册身份验证策略。
    该代码创建了一个名为 admin_greetings 的新授权策略，该策略封装了两个授权要求：
        一个通过 RequireRole 实现的基于角色的要求，面向具有 admin 角色的用户。
        一个通过 RequireClaim 实现的基于声明的要求，即用户必须提供 greetings_api 范围声明。
    admin_greetings 策略作为 /hello 终结点所需的策略提供。
builder.Services.AddAuthorizationBuilder()
  .AddPolicy("admin_greetings", policy =>
        policy
            .RequireRole("admin")
            .RequireClaim("scope", "greetings_api"));*/

// 添加授权
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// 添加 Swagger
//builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Emotion app", Version = "v1" });
});

// 注册 MVC 控制器服务，自动扫描所有 Controller（需放在项目中符合约定的 Controller 类）
builder.Services.AddControllers();

builder.Services.AddScoped<ITokenService, TokenService>();

// 添加数据库服务
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 40));

// ✅ 正确注册 AppDbContext
builder.Services.AddDbContext<EmotionAppContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 33)) // 版本替换为你实际的 MySQL 版本
    )
);

// 依赖注入
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<DiaryService>();
builder.Services.AddScoped<DiaryRepository>();
builder.Services.AddScoped<SentimentAnalysisRepository>();
builder.Services.AddScoped<SentimentAnalysisService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
    Console.WriteLine($"http://localhost:5081/scalar");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); // 允许跨域请求
app.UseAuthentication(); // 使用鉴权服务
app.UseAuthorization(); // 使用授权服务

app.UseHttpsRedirection();

// 使用 MapControllers()，让框架自动根据控制器上的 [Route] 属性配置路由
app.MapControllers();

app.Run();
