using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using volunteer;
using volunteer.DataModels;

//https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0

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
    options.AddPolicy("AllowLocalHost",
    builder =>
    {
        builder.WithOrigins("http://127.0.0.1")
        .AllowCredentials()
        .AllowAnyHeader()
        .SetIsOriginAllowed((host) => true)
        .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

////////////////////////////////////////////////////////////////////////////////////

// if (app.Environment.IsDevelopment())
// {
//     app.Use(async (context, next) =>
//     {
//         foreach (var header in context.Request.Headers)
//         {
//             Console.WriteLine($"{header.Key}: {header.Value}");
//         }
//         await next.Invoke();
//     });
// }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalHost");

////////////////////////////////////////////////////////////////////////////////////
// Endpoints

// Very basic login, no authentication. Authentication is assumed to be deferred to OAuth
app.MapPost("/login", async (User user) => {
    using(VDatabaseContext context = new VDatabaseContext())
    {
        User? selectedUser = await context.Users.FirstOrDefaultAsync(u => 
            String.Equals(u.FirstName.ToLower(), user.FirstName.ToLower()) && 
            String.Equals(u.LastName.ToLower(), user.LastName.ToLower())
        );

        if (selectedUser is not null) {
            Console.WriteLine($"Logged in User {selectedUser.FirstName} {selectedUser.LastName}");
            return Results.Ok(selectedUser);
        }
        else
        {
            return Results.NotFound("User not found");
        }
    }
})
.WithName("DefaultLoginUser")
.WithOpenApi();

// Create a new user
app.MapPost("/newUser", (User user) => {
    try
    {
        using(VDatabaseContext db = new VDatabaseContext())
        {
            db.Users.Add(user);
            db.SaveChanges();
            db.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
        return Results.Ok($"Successfully Created User {user}");
    }
    catch(Exception e)
    {
        return Results.BadRequest(e.Message);
    }
})
.WithName("CreateNewUser")
.WithOpenApi();

// Allow volunteer to sign up for an event
app.MapPost("/signUp", ([FromBody] SignUpObject obj) => {
    try
    {
        Console.WriteLine("Sign up");
        Console.WriteLine(obj.EventId);
        Console.WriteLine(obj.UserFirstName);
        Console.WriteLine(obj.UserLastName);

        using(VDatabaseContext context = new VDatabaseContext())
        {
            Event? selectedEvent = context.Events.Find(obj.EventId);
            if (selectedEvent is null)
            {
                return Results.BadRequest("Invalid event");
            }
            Console.WriteLine(selectedEvent);

            User? selectedUser = context.Users.FirstOrDefault(u => 
                String.Equals(u.FirstName.ToLower(), obj.UserFirstName.ToLower()) && 
                String.Equals(u.LastName.ToLower(), obj.UserLastName.ToLower())
            );
            Console.WriteLine(selectedUser);
            
            if (selectedUser is null)
            {
                selectedUser = new User{FirstName=obj.UserFirstName, LastName=obj.UserLastName};
                context.Users.Add(selectedUser);
                context.SaveChanges();
                Console.WriteLine("User did not exist. Creating user.");
            }

            AssocEvent? existingSignup = context.AssocEvents.FirstOrDefault(ae => ae.UserId == selectedUser.Id && ae.EventId == selectedEvent.Id);

            UserReturn userResult = new UserReturn{Id = selectedUser.Id, FirstName = selectedUser.FirstName, LastName = selectedUser.LastName};
            
            if (existingSignup is not null)
            {
                Console.WriteLine($"Already signed up {existingSignup.EventId}");
                return Results.Ok(userResult);
            }

            AssocEvent signup = new AssocEvent{ UserId = selectedUser.Id, EventId = selectedEvent.Id };
            context.AssocEvents.Add(signup);
            context.SaveChanges();
            context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
            Console.WriteLine($"Signed user ID {selectedUser.Id} for Event ID {signup.EventId}");

            return Results.Ok(userResult);
        }

    }
    catch (Exception e)
    {
        return Results.BadRequest($"Unable to sign up user for event: {e.Message}");
    }
})
.WithName("SignUp")
.WithOpenApi();

/// Corrected by ChatGPT-4o
app.MapPost("/getSignUps", async ([FromBody] UserReturn user) => {
    try
    {
        using(VDatabaseContext context = new VDatabaseContext())
        {
            User? selectedUser = await context.Users.FirstOrDefaultAsync(u => u.FirstName == user.FirstName && u.LastName == user.LastName);
            if (selectedUser is null)
            {
                return Results.BadRequest("Invalid user");
            }

            // Get all associated event IDs for the user
            var eventIds = await context.AssocEvents
                .Where(ae => ae.UserId == selectedUser.Id)
                .Select(ae => ae.EventId)
                .ToListAsync();

            // Get all events matching the IDs
            var events = await context.Events
                .Where(e => eventIds.Contains(e.Id))
                .ToListAsync();

            if (events is null)
            {
                Results.NotFound("No events found");
            }

            return Results.Ok(events);
        }
    }
    catch (Exception e)
    {
        return Results.Problem($"An error occurred when trying to retreive events: {e.Message}");
    }
})
.WithName("GetSignUps")
.WithOpenApi();

////////////////////////////////////////////////////////////////////////////////////

// Retreive Events from Database
app.MapGet("/getEvents", () =>
{
    Console.WriteLine("GET Events");
    using(VDatabaseContext context = new VDatabaseContext())
    {
        List<Event>? events = context.Events.ToList();
        return Results.Ok(events);
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
        if (evnt.Title is null || evnt.Description is null || evnt.Date is null)
        {
            return Results.BadRequest($"Unable to create event: Missing data");
        }

        using(VDatabaseContext context = new VDatabaseContext())
        {
            context.Add(evnt);
            context.SaveChanges();
            context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");

            Console.WriteLine($"Created Event: {evnt}");
            return Results.Ok(new EventReturn(evnt));
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
        if (evnt.Title is null || evnt.Description is null || evnt.Date is null)
        {
            return Results.BadRequest($"Unable to create event: Missing data");
        }

        using(VDatabaseContext context = new VDatabaseContext())
        {
            Event? selectedEvent = context.Events.FirstOrDefault(dbEvent => dbEvent.Id == evnt.Id);
            if (selectedEvent is not null)
            {
                selectedEvent.Title = evnt.Title;
                selectedEvent.Description = evnt.Description;
                selectedEvent.Date = evnt.Date;
                context.Update(selectedEvent);
                context.SaveChanges();
            }
            Console.WriteLine($"Updated Event: {evnt}");
            return Results.Ok(new EventReturn(evnt));
        }
    }
    catch (Exception e)
    {
        return Results.BadRequest($"Unable to edit event {evnt}: {e.Message}");
    }
})
.WithName("UpdateEvent")
.WithOpenApi();

// Reset Data for testing purposes
app.MapGet("/resetData", () => {
    Console.WriteLine("Resetting Database");
    try
    {
        using(DbContext context = new VDatabaseContext())
        {
            // Destroy then (re)create database
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

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
                    context.Add(item);
                }
                #pragma warning restore CS8602 // Dereference of a possibly null reference.
            };

            using (StreamReader r = new StreamReader("users.json"))
            {
                string? json = r.ReadToEnd();
                List<User>? source = JsonSerializer.Deserialize<List<User>>(json, options);

                #pragma warning disable CS8602
                foreach (var item in source)
                {
                    context.Add(item);
                }
                #pragma warning restore CS8602
            };

            context.SaveChanges();
            context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
    }
    catch (Exception e)
    {
        Console.WriteLine("Error resetting database: " + e.Message);
    }
})
.WithName("Reset")
.WithOpenApi();

app.Run();
