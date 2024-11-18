namespace volunteer.DataModels;

/// <summary>
/// For the /signup endpoint
/// </summary>
public class SignUpObject
{
    public int    EventId       { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName  { get; set; } = string.Empty;
}