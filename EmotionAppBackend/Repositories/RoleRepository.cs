using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class RoleRepository(EmotionAppContext _context)
{
    /**
     * 根据角色名称查询角色
     */
    public async Task<Role?> GetRoleByName(string name)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == name);
        return role;
    }
}
