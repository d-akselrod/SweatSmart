using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using Microsoft.AspNetCore.Http.HttpResults;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly DatabaseContext database;

    public UserController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await database.Users.ToListAsync();
        return Ok(users);
    }

    [Authorize]
    [HttpGet("username/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        try
        {
            var user = await database.Users.SingleAsync(user => user.Username == username);
            return Ok(user);
        }
        catch (InvalidOperationException)
        {
            return NotFound("No account exists with the username: " + username);
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddUser(User newUser)
    {
        await database.Users.AddAsync(newUser);
        await database.SaveChangesAsync();

        return Ok(newUser);
    }

    [Authorize]
    [HttpDelete("{username}")]
    public async Task<IActionResult> DeleteUserByUsername(string username)
    {
        try
        {
            var user = await database.Users.SingleAsync(user => user.Username == username);
            database.Users.Remove(user);
            await database.SaveChangesAsync();
            return Ok();
        }
        catch (InvalidOperationException)
        {
            return NotFound("No account exists with the username: " + username);
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateUser(string username, User updatedUser)
    {
        try
        {
            var user = await database.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound("No account exists with the username: " + username);
            }

            var oldUser = user;
            updatedUser.UId = oldUser.UId;

            database.Users.Remove(oldUser);
            database.Users.AddAsync(updatedUser);
            await database.SaveChangesAsync();
            return Ok(updatedUser);
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }
}
