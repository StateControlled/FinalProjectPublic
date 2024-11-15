using System.Security.Cryptography;

namespace volunteer.DataModels;

public class PrivateUser
{
    public int    Id           { get; set; }
    public string Name         { get; set; }
    public string Username     { get; set; }
    public string Password     { get; set; }
    public string Base64Creds  { get; set; }
    public string Hash         { get; set; }
    public string Preferences  { get; set; }

    /// <summary>
    /// Constructs a new PrivateUser object, hashes password and generates an Id
    /// to hide protected data from outside observers
    /// </summary>
    /// <param name="username"></param>
    /// <param name="password"></param>
    public PrivateUser(string username, string password)
    {
        this.Id         = RandomNumberGenerator.GetInt32(1, 9999);
        this.Username   = username;
        this.Name       = username;

        this.Base64Creds    = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(username + ":" + password));
        var byteCredentials = Convert.FromBase64String(this.Base64Creds);

        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(byteCredentials);
            System.Text.StringBuilder builder = new System.Text.StringBuilder();

            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            this.Hash = builder.ToString();
        }
        this.Password = this.Hash;

        this.Preferences = "default";
    }

}