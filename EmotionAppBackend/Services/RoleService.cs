using EmotionAppBackend.Models;

public class RoleService
{
    private readonly RoleRepository _roleRepository;

    public RoleService(RoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    /**
     * 根据角色名称获取角色
     */
    public async Task<Role> GetRoleByName(string roleName) =>
        await _roleRepository.GetRoleByName(roleName) ?? throw new Exception("角色不存在");
}
