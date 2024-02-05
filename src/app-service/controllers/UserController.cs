using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly EncryptionHelper encryptionHelper;

    public UserController(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;
        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await database.Users.ToListAsync();
        return Ok(users);
    }

    [Authorize]
    [HttpGet("{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
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
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == username);

        if (user == null)
        {
            return NotFound();
        }

        database.Users.Remove(user);
        await database.SaveChangesAsync();
        return Ok();
    }

    [Authorize]
    [HttpPut("{username}")]
    public async Task<IActionResult> UpdateUser(string username, User updatedUser)
    {
        var user = await database.Users.SingleOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return NotFound();
        }

        var oldUser = user;
        updatedUser.UId = oldUser.UId;

        database.Users.Remove(oldUser);
        await database.Users.AddAsync(updatedUser);
        await database.SaveChangesAsync();
        return Ok(updatedUser);
    }
}
