namespace volunteer.DataModels;

/// <summary>
/// An event that a User can sign up for.
/// </summary>
public class Event
{
    public int    Id           { get; set; }
    public string Title        { get; set; } = string.Empty;
    public string Description  { get; set; } = string.Empty;
    public string Date         { get; set; } = string.Empty;

    public ICollection<AssocEvent> UserEvents { get; set; } = new List<AssocEvent>();

    public override string ToString()
    {
        return $"{{id: {Id},title: {Title},description: {Description},date: {Date}}}";
    }

}