using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class UserRepository(EmotionAppContext _context)
{
    /**
     * 获取所有用户
     */
    public async Task<List<User>> GetAllUsers() => await _context.Users.ToListAsync();

    /**
     * 根据用户ID查询用户
     */
    public async Task<User?> GetUserById(int id) => await _context.Users.FindAsync(id);

    /**
     * 添加用户
     */
    public async Task AddUser(User user)
    {
        try
        {
            // Ensure password is hashed
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = user.Password.Md5String();
            }

            // Validate required fields
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                throw new ArgumentException("Username and Password are required");
            }

            // Set creation timestamp if not already set
            if (user.CreatedAt == null)
            {
                user.CreatedAt = DateTime.UtcNow;
            }

            // Add user to context
            _context.Users.Add(user);

            // Save changes and ensure at least 1 row was affected
            int rowsAffected = await _context.SaveChangesAsync();

            if (rowsAffected <= 0)
            {
                throw new Exception("Failed to save user to database");
            }
        }
        catch (DbUpdateException ex)
        {
            // Handle specific database errors (like unique constraint violations)
            if (ex.InnerException?.Message.Contains("Duplicate entry") == true)
            {
                throw new InvalidOperationException(
                    "A user with this username, email, or phone already exists",
                    ex
                );
            }
            throw new Exception($"Database error while adding user: {ex.Message}", ex);
        }
    }

    /**
     * 登录
     */
    internal async Task<User?> Login(string email, string password)
    {
        var pwdMd5 = password.Md5String();
        var user = await _context
            .Users
            //查询角色
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Email == email && u.Password == pwdMd5);
        return user;
    }

    /**
     * 根据邮箱查询用户
     */
    public async Task<User?> GetUserByEmail(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        return user;
    }
}
