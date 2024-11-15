using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;

using volunteer;
using volunteer.DataModels;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow requests from specific origins
// Add Services: Add services to the container, including Swagger (just above on line 9) for API documentation and CORS for cross-origin requests.
// CORS Configuration: Configure CORS to allow requests from http://127.0.0.1 with any header and method.
builder.Services.AddCors(options => 
{
    options.AddPolicy("AllowAllOrigins",
    builder =>
    {
        builder.WithOrigins("http://127.0.0.1")
        .AllowCredentials()
        .AllowAnyHeader()
        .SetIsOriginAllowed((host) => true)
        .AllowAnyMethod();
    });
});

////////////////////////////////////////////////////////////////////////////////////
// Authentication - having access to a system
// Authorization - what you have access to in that system
// Defining basic authentication
builder.Services.AddAuthorization();
builder.Services.AddAuthentication("BasicAuthentication").AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("basic", new OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = SecuritySchemeType.Http,
        Scheme      = "basic",
        In          = ParameterLocation.Header,
        Description = "Basic Authorization header using the Bearer scheme."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "basic"
                }
            },
            new string[] {}
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");
app.UseCors("AllowAzure");

////////////////////////////////////////////////////////////////////////////////////
// Users and Authentication

// Create a new user
app.MapPost("/newUser", (User user) => {
    try
    {
        using(UserContext db = new UserContext())
        {
            db.Users.Add(user.GetPrivateUser());
            db.SaveChanges();
            db.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
        return Results.Ok("Successfully Created User");
    }
    catch(Exception e)
    {
        return Results.BadRequest(e.Message);
    }
})
.WithName("CreateNewUser")
.WithOpenApi();

app.MapPost("/login", (User user) => {
    using(var db = new UserContext())
    {
        var privateUser = db.Users.FirstOrDefault(pu => pu.Username == user.Username);

        if (privateUser != null) {
            Console.WriteLine($"Logged in User {user.Username}");
            return Results.Ok(privateUser); // Return the token that goes with the user
        }
        else
        {
            return Results.Unauthorized();
        }
    }
})
.WithName("LoginUser")
.WithOpenApi()
.RequireAuthorization(new AuthorizeAttribute() { AuthenticationSchemes="BasicAuthentication" });

app.MapPost("/signUp", () => {
    Console.WriteLine("Sign up");
})
.WithName("SignUp")
.WithOpenApi()
.RequireAuthorization();

////////////////////////////////////////////////////////////////////////////////////

// Retreive Events from Database
app.MapGet("/getEvents", () =>
{
    Console.WriteLine("GET Events");
    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    using(EventContext context = new EventContext())
    {
        List<Event>? source = context.Events.ToList();
        return source;
    }
})
.WithName("GetEvents")
.WithOpenApi();

// Add a new Event
app.MapPost("/postEvent", (Event evnt) =>
{
    Console.WriteLine("POST Event");
    try
    {
        using(EventContext context = new EventContext())
        {
            context.Add(evnt);
            context.SaveChanges();

            Console.WriteLine($"Created Event: {evnt}");
            return Results.Ok(evnt);
        }
    }
    catch (Exception e)
    {
        return Results.BadRequest($"Unable to create event: {e.Message}");
    }
})
.WithName("PostEvent")
.WithOpenApi();

// Update an existing event
app.MapPut("/updateEvent", (Event evnt) =>
{
    try
    {
        Console.WriteLine("PUT Event");
        using(EventContext context = new EventContext())
        {
            Event? e = context.Events.Where(c => c.Id == evnt.Id).FirstOrDefault();
            if (e != null)
            {
                e.Title = evnt.Title;
                e.Description = evnt.Description;
                e.Date = evnt.Date;
                context.Update(e);
                context.SaveChanges();
            }
            Console.WriteLine($"Updated Event: {evnt}");
            return Results.Ok(evnt);
        }
    }
    catch (Exception e)
    {
        return Results.BadRequest($"Unable to edit event {evnt}: {e.Message}");
    }
})
.WithName("UpdateEvent")
.WithOpenApi()
.RequireAuthorization();

// Reset Data for testing purposes
app.MapGet("/resetData", () => {
    Console.WriteLine("Resetting Database");
    using(DbContext events = new EventContext())
    {
        // Destroy then (re)create database
        events.Database.EnsureDeleted();
        events.Database.EnsureCreated();

        // Read data from JSON file
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        using (StreamReader r = new StreamReader("events.json"))
        {
            string? json = r.ReadToEnd();
            List<Event>? source = JsonSerializer.Deserialize<List<Event>>(json, options);

            #pragma warning disable CS8602 // Suppress 'Dereference of a possibly null reference' warning.
            foreach (var item in source)
            {
                events.Add(item);
            }
            #pragma warning restore CS8602 // Dereference of a possibly null reference.
        };
        events.SaveChanges();
        events.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }
})
.WithName("Reset")
.WithOpenApi();

app.Run();
