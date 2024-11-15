namespace volunteer.DataModels;

/// <summary>
/// User object - connects with PrivateUser for authentication
/// </summary>
public class User
{
    protected PrivateUser PrivateUser;
    public string Username              { get; set; }
    public string Password              { get; set; }

    public User(string username, string password)
    {
        this.Username = username;
        this.Password = password;
        this.PrivateUser = new PrivateUser(username, password);
    }

    public PrivateUser GetPrivateUser() {
        return this.PrivateUser;
    }
}