using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EmotionAppBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

/**
 * 自定义授权处理器
 */
public class CustomAuthorizationHandler : AuthorizationHandler<CustomRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    private readonly UserService _userService;

    /**
     * 构造函数
     * @param httpContextAccessor
     * @param serviceScopeFactory
     * @param userService
     */
    // 依赖注入 IHttpContextAccessor 、 IServiceScopeFactory 以及 UserService
    public CustomAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor,
        IServiceScopeFactory serviceScopeFactory,
        UserService userService
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _serviceScopeFactory = serviceScopeFactory;
        _userService = userService;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CustomRequirement requirement
    )
    {
        // context.User 是当前请求的用户对象
        // FindFirstValue(ClaimTypes.NameIdentifier) 从 ClaimsPrincipal 中获取用户的标识符（通常是用户的 ID），这通常会被存储为一个声明（Claim）。如果用户没有这个声明，它将返回 null 或空字符串。
        var userIdString = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString))
        {
            // TODO: 这里是一个待办事项
            return; // 用户未登录，直接返回
        }

        // 尝试将 userIdString 转换为 int
        if (!int.TryParse(userIdString, out var userId))
        {
            // 如果转换失败，可以记录日志，或者抛出异常
            // 这里可以选择返回一个失败的授权
            return;
        }

        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<EmotionAppContext>();

            // 查询数据库，检查用户角色
            var userRoles = await dbContext
                .Users.Where(u => u.UserId == userId)
                .Select(u => u.Roles)
                .FirstOrDefaultAsync();

            //获取角色名称列表
            var userRoleNames = userRoles?.Select(r => r.RoleName).ToList();

            // 如果找到了用户角色并且角色匹配要求，则授权成功
            if (userRoleNames != null && userRoleNames.Contains(requirement.RequiredRole))
            {
                context.Succeed(requirement); // 如果用户角色包含所需角色，授权通过
            }
        }
    }
}
