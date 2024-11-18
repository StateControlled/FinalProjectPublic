using Microsoft.EntityFrameworkCore;

using volunteer.DataModels;

namespace volunteer;

public class VDatabaseContext : DbContext
{
    public DbSet<Event>         Events      { get; set; }
    public DbSet<User>          Users       { get; set; }
    public DbSet<AssocEvent>    AssocEvents { get; set; }

    #pragma warning disable CS8618 // Suppress Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
    public VDatabaseContext()
    #pragma warning restore CS8618
    {
        ;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AssocEvent>()
            .HasKey(ue => new { ue.UserId, ue.EventId }); // Composite key

        modelBuilder.Entity<AssocEvent>()
            .HasOne(ue => ue.User)
            .WithMany(u => u.UserEvents)
            .HasForeignKey(ue => ue.UserId);

        modelBuilder.Entity<AssocEvent>()
            .HasOne(ue => ue.Event)
            .WithMany(e => e.UserEvents)
            .HasForeignKey(ue => ue.EventId);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlite($"Data Source=volunteer.db");

}

// Creating database
// dotnet tool install --global dotnet-ef
// dotnet ef migrations add InitialCreate
// dotnet ef database update
// dotnet ef migrations add createUsers --context UserContext
// dotnet ef database update --context UserContext
// dotnet ef migrations add publicprivateusers --context UserContext
// dotnet ef database update --context UserContext