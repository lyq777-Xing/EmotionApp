using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class UserRepository(EmotionAppContext _context)
{
    public async Task<List<User>> GetAllUsers() => await _context.Users.ToListAsync();

    public async Task<User?> GetUserById(int id) => await _context.Users.FindAsync(id);

    public async Task AddUser(User user)
    {
        _context.Users.Add(user);
        //var userOrders = from u in _context.Users
        //                 join o in _context.Orders on u.Id equals o.UserId
        //                 select new { u.Name, o.OrderNumber };
        await _context.SaveChangesAsync();
    }

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
}
