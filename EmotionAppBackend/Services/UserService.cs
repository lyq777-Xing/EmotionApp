using EmotionAppBackend.Models;

public class UserService
{
    private readonly UserRepository _userRepository; 

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<User>> GetUsers() => await _userRepository.GetAllUsers();

    public async Task AddUser(User user) => await _userRepository.AddUser(user);
}