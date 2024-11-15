using Microsoft.EntityFrameworkCore;

using volunteer.DataModels;

namespace volunteer;

public class EventContext : DbContext
{   
    public DbSet<Event> Events { get; set; }

    public EventContext()
    {
        ;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)=> options.UseSqlite($"Data Source=events.db");

}