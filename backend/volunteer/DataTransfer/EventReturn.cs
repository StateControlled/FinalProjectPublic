namespace volunteer.DataModels;

/// <summary>
/// Simpler event for returning to the frontend
/// </summary>
public class EventReturn(Event evnt)
{
    public int    Id            { get; set; } = evnt.Id;
    public string Title         { get; set; } = evnt.Title;
    public string Description   { get; set; } = evnt.Description;
    public string Date          { get; set; } = evnt.Date;

    public override string ToString()
    {
        return $"{{id: {Id},title: {Title},description: {Description},date: {Date}}}";
    }

}