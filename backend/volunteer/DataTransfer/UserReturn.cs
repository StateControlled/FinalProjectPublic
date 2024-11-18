namespace volunteer.DataModels;

/// <summary>
/// Simplified User object for returning to Frontend
/// </summary>
public class UserReturn
{
    public int    Id        { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;


    public override string ToString()
    {
        return $"{{id: {Id},First Name: {FirstName},Last Name: {LastName}}}";
    }

}