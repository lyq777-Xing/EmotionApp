using System;
using System.Linq;
using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class MathUtilsTests
{
    [TestMethod]
    public void MysqlTest()
    {
        try
        {
            using (var context = new EmotionAppContext())
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
