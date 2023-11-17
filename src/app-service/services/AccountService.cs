using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.services;

public record LoginRequest(string? Username, string? Email, string Password);

public record RegisterRequest(string Username, string Email, string Password);

[ApiController]
[Route("[controller]")]

public class AccountService : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly UserController userController;

    public AccountService(DatabaseContext database)
    {
        this.database = database;
        userController = new UserController(database);
    }

    [Authorize]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginRequest body)
    {
        var username = body.Username;
        var email = body.Email;
        var password = body.Password;

        if ((username == null && email == null) || (username != null && email != null))
        {
            return APIResponse.BadRequest;
        }
        var user = username != null
            ? await database.Users.SingleOrDefaultAsync(user => user.Username == username)
            : await database.Users.SingleOrDefaultAsync(user => user.Email == email);

        if (user == null)
        {
            return new APIResponse(404, "Account not found", null);
        }

        return password == user.Password
            ? new APIResponse(200, null, user)
            : new APIResponse(401, "Incorrect Password", null);
    }

    [Authorize]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegisterRequest body)
    {
        var username = body.Username;
        var email = body.Email;
        var password = body.Password;

        if (await database.Users.AnyAsync(user => user.Email == email))
        {
            return new APIResponse(409, "Email already exists", null);
        }

        if (await database.Users.AnyAsync(user => user.Username == username))
        {
            return new APIResponse(409, "Username already exists", null);
        }

        var newUser = new User
        {
            Email = email,
            Username = username,
            Password = password
        };

        await userController.AddUser(newUser);
        return new APIResponse(200, null, newUser);
    }
}