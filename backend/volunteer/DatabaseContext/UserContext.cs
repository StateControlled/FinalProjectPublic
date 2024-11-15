using Microsoft.EntityFrameworkCore;

using volunteer.DataModels;

namespace volunteer;

public class UserContext : DbContext
{
    public DbSet<PrivateUser> Users { get; set; }

    public UserContext()
    {
        ;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options) => options.UseSqlite($"Data Source=users.db");

}

// Creating database
// dotnet tool install --global dotnet-ef
// dotnet ef migrations add InitialCreate
// dotnet ef database update
// dotnet ef migrations add createUsers --context UserContext
// dotnet ef database update --context UserContext
// dotnet ef migrations add publicprivateusers --context UserContext
// dotnet ef database update --context UserContext