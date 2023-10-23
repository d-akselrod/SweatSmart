using System.Security.Authentication;
using System.Text.RegularExpressions;
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

    public AccountService(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginRequest body)
    {
        try
        {
            var username = body.Username;
            var email = body.Email;
            var password = body.Password;

            if ((username == null && email == null) || (username != null && email != null) || password == null)
            {
                return BadRequest();
            }

            var user = username != null
                ? await database.Users.SingleOrDefaultAsync(user => user.Username == username)
                : await database.Users.SingleOrDefaultAsync(user => user.Email == email);

            if (user == null)
            {
                return username == null
                    ? StatusCode(1002)
                    : StatusCode(1003);
            }

            return password == user.Password ? Ok() : StatusCode(1004);
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    [Authorize]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegisterRequest body)
    {
        try
        {
            var username = body.Username;
            var email = body.Email;
            var password = body.Password;

            if (username == null || email == null || password == null)
            {
                return BadRequest();
            }

            if (await database.Users.AnyAsync(user => user.Email == email))
            {
                return StatusCode(1000);
            }

            if (await database.Users.AnyAsync(user => user.Username == username))
            {
                return StatusCode(1001);
            }

            // Regex pattern = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$");
            // if (pattern.IsMatch(password) == false)
            // {
            //     return StatusCode(1005);
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
        catch (Exception)
        {
            return StatusCode(500);
        }
    }
}