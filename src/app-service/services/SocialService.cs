using System.Data.Common;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace App_Service.services;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public record UserProfile(Guid uId, string username, string? name);

public record FilterUsersRequest(string username, string? filter);

[ApiController]
[Route("[controller]")]
public class SocialService : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly UserController userController;
    private readonly EncryptionHelper encryptionHelper;

    public SocialService(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;
        userController = new UserController(database);

        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);
    }

    private UserProfile GetUserProfile(Guid uId)
    {
        var user = database.Users.Find(uId);
        if (user == null)
        {
            return null;
        }
        return new UserProfile(user.UId, encryptionHelper.Decrypt(user.Username), encryptionHelper.Decrypt(user.Name));
    }

    [Authorize]
    [HttpPost("Filter")]
    public async Task<IActionResult> FilterUsers(FilterUsersRequest body)
    {
        var username = body.username; // This is the decrypted username of the primary user
        var filter = body.filter?.ToLower() ?? string.Empty;

        var allUsers = await database.Users.ToListAsync();
        var decryptedUsers = allUsers.Select(user => new
        {
            User = user,
            DecryptedUsername = encryptionHelper.Decrypt(user.Username).ToLower()
        }).ToList();

        var filteredUsers = decryptedUsers
            .Where(u => u.DecryptedUsername.Contains(filter))
            .Select(u => u.User)
            .ToList();

        var friends = await database.Friends
            .Where(f => f.Friend1 == username || f.Friend2 == username)
            .ToListAsync();
        var friendUsernames = friends
            .SelectMany(f => new[] { f.Friend1, f.Friend2 })
            .Distinct()
            .ToList();

        var prioritizedUsers = filteredUsers
            .OrderByDescending(u => friendUsernames.Contains(encryptionHelper.Decrypt(u.Username)))
            .Take(20)
            .Select(u => new UserProfile(u.UId, encryptionHelper.Decrypt(u.Username), encryptionHelper.Decrypt(u.Name)))
            .ToList();

        return new APIResponse(200, null, prioritizedUsers);
    }
}