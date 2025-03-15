

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseMySql("server=118.31.55.155;user=root;password=lyq;database=EmotionApp;",
                new MySqlServerVersion(new Version(8, 0, 40)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure());
            /*var connectionString = "server=cloud.lk233.link;user=root;password=lyq;database=EmotionApp;";
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 40));
            builder.Services.AddDbContext<AppDbContext>(
                dbContextOptions => dbContextOptions
                    .UseMySql(connectionString, serverVersion)
                    // The following three options help with debugging, but should
                    // be changed or removed for production.
                    .LogTo(Console.WriteLine, LogLevel.Information)
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors()
            );*/
        }
    }
    public DbSet<User> Users { get; set; }
}