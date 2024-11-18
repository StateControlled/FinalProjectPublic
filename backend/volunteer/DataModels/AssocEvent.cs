using System.Security.Cryptography;

namespace volunteer.DataModels;

/// <summary>
/// For associating an event with a user
/// </summary>
public class AssocEvent
{
    public int UserId   { get; set; }
    public User User    { get; set; } = null!;
    
    public int EventId  { get; set; }
    public Event Event  { get; set; } = null!;

}