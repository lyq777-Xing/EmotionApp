using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


/**
 * 自定义授权处理器
 */
public class CustomAuthorizationHandler : AuthorizationHandler<CustomRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public CustomAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor,
        IServiceScopeFactory serviceScopeFactory)
    {
        _httpContextAccessor = httpContextAccessor;
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CustomRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return; // 用户未登录，直接返回
        }

        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // 查询数据库，检查用户角色
            //var userRole = await dbContext.Users
                //.Where(ur => ur.UserId == userId)
                //.Select(ur => ur.RoleName)
                //.FirstOrDefaultAsync();

            //if (userRole == requirement.RequiredRole)
            //{
                //context.Succeed(requirement); // 授权通过
            //}
        }
    }
}
