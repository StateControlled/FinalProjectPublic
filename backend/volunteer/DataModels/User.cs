namespace volunteer.DataModels;

/// <summary>
/// User object
/// </summary>
public class User
{
    public int    Id        { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;

    public ICollection<AssocEvent> UserEvents { get; set; } = new List<AssocEvent>();

    public override string ToString()
    {
        return $"{{id: {Id},First Name: {FirstName},Last Name: {LastName}}}";
    }

}