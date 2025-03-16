using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[TestClass]
public class MathUtilsTests
{
    [TestMethod]
    public void MysqlTest()
    {
        try
        {
            using (var context = new AppDbContext())
            {
                var users = context.Users.ToList(); // 使用 EF Core 查询所有用户

                Console.WriteLine("Connected to MySQL!");
                foreach (var user in users)
                {
                    Console.WriteLine(user.ToString());
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
