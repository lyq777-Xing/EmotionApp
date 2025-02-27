using Microsoft.VisualStudio.TestTools.UnitTesting;
using MySql.Data.MySqlClient;

[TestClass]
public class MathUtilsTests
{
    [TestMethod]
    public void Add_TwoNumbers_ReturnsSum()
    {
        string connectionString = "server=localhost;user=root;password=lyq;database=EmotionApp;";

        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            try
            {
                connection.Open();
                Console.WriteLine("Connected to MySQL!");

                // 示例：执行查询
                string query = "SELECT * FROM user;";
                MySqlCommand command = new MySqlCommand(query, connection);

                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Console.WriteLine(reader["user_name"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}