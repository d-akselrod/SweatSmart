using System.Security.Authentication;
using System.Text.RegularExpressions;
using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.services;

[ApiController]
[Route("[controller]")]

public class AccountService : ControllerBase
{
    private readonly DatabaseContext database;

    public AccountService(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(string? username, string? email, string? password)
    {
        if (username == null && email == null)
        {
            return BadRequest("Please provide a username or email");
        }

        if (username != null && email != null)
        {
            return BadRequest("Please don't provide both a username and an email");
        }

        if (password == null)
        {
            return BadRequest("Please enter a password");
        }

        var user = username != null
            ? await database.Users.SingleOrDefaultAsync(user => user.Username == username)
            : await database.Users.SingleOrDefaultAsync(user => user.Email == email);

        if (user == null)
        {
            return BadRequest("No user found with the " + (username != null
                ? "username of " + username
                : "email of " + email));
        }

        return password == user.Password ? Ok("Successful Login") : BadRequest("Invalid password");
    }

    [Authorize]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(string username, string email, string password)
    {
        if (await database.Users.AnyAsync(user => user.Email == email))
        {
            return BadRequest("An account already exists with the email: " + email);
        }

        if (await database.Users.AnyAsync(user => user.Username == username))
        {
            return BadRequest("An account already exists with the username: " + username);
        }

        //Regex passwordPattern = new Regex("");
        //if (passwordPattern.IsMatch(password) == false)
        // {
        //     return BadRequest("Invalid password");
        // }

        UserController userController = new UserController(database);

        var newUser = new User
        {
            Email = email,
            Username = username,
            Password = password
        };

        userController.AddUser(newUser);
        return Ok(newUser);
    }
}