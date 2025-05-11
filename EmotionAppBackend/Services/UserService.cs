using EmotionAppBackend.Models;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /**
     * 获取所有用户
     */
    public async Task<List<User>> GetUsers() => await _userRepository.GetAllUsers();

    /**
     * 添加用户
     */
    public async Task AddUser(User user) => await _userRepository.AddUser(user);

    /**
     * 登录
     */
    internal async Task<User> ValidateUser(string email, string password) =>
        await _userRepository.Login(email, password);

    /**
     * 根据用户邮箱查询用户
     */
    public async Task<User?> GetUserByEmail(String email) =>
        await _userRepository.GetUserByEmail(email);

    /**
     * 根据用户id查询用户信息
     */
    public async Task<User?> GetUserById(int userId) => await _userRepository.GetUserById(userId);
}
