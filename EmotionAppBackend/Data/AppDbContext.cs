

using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : EmotionAppContext
{
    // public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //     if (!optionsBuilder.IsConfigured)
    //     {
    //         optionsBuilder.UseMySql("server=118.31.55.155;user=root;password=lyq;database=EmotionApp;",
    //             new MySqlServerVersion(new Version(8, 0, 40)),
    //             mySqlOptions => mySqlOptions.EnableRetryOnFailure());
    //     }
    // }
    // public DbSet<User> Users { get; set; }
}