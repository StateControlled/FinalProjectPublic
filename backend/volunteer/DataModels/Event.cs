using System.Security.Cryptography;

namespace volunteer.DataModels;

public class Event
{
    public int? Id              { get; set; }
    public string? Title        { get; set; }
    public string? Description  { get; set; }
    public string? Date         { get; set; }
    // public string? Volunteer    { get; set; }

    /// <summary>
    /// Constructs a new Event object. Checks for null values and replaces with placeholder data.
    /// </summary>
    public Event(int? id, string title, string description, string date)
    {
        this.Id             = (id == null || id <= 0) ? generateId() : id;
        this.Title          = !string.IsNullOrEmpty(title) ? title : "DEFAULT TITLE";
        this.Description    = !string.IsNullOrEmpty(description) ? description : "DEFAULT DESCRIPTION";
        this.Date           = date ?? "2024-01-01";
        // this.Volunteer      = !string.IsNullOrEmpty(volunteer) ? volunteer : null;
    }

    private static int generateId()
    {
        return RandomNumberGenerator.GetInt32(1, 9999);
    }

    public override string ToString()
    {
        return $"[ID: {Id}] Title: {Title}{Environment.NewLine}Description: {Description}{Environment.NewLine}Due Date: {Date}{Environment.NewLine}";
    }

}