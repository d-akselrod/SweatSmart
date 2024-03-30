using System.Data.Common;
using App_Service.Typings;
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
        userController = new UserController(database, configuration);

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

    private UserProfile GetUserProfile(string encryptedUsername)
    {
        var user = database.Users.SingleOrDefault(u => u.Username == encryptedUsername);

        if (user == null)
        {
            return null;
        }

        return new UserProfile(user.UId, encryptionHelper.Decrypt(user.Username), encryptionHelper.Decrypt(user.Name));
    }

    [Authorize]
    [HttpGet("Friends")]
    public async Task<IActionResult> GetFriends(string username)
    {
        var encryptedUsername = encryptionHelper.Encrypt(username);

        var friends = await database.Friends
            .Where(f => f.Friend1 == encryptedUsername || f.Friend2 == encryptedUsername)
            .ToListAsync();

        var friendUsernames = friends
            .SelectMany(f => new[] { f.Friend1, f.Friend2 })
            .Distinct()
            .Where(f => f != encryptedUsername)
            .ToList();

        var friendProfiles = friendUsernames
            .Select(f => GetUserProfile(f))
            .ToList();

        return new APIResponse(200, null, friendProfiles);
    }

    [Authorize]
    [HttpPost("Filter")]
    public async Task<IActionResult> FilterUsers(FilterUsersRequest body)
    {
        var username = body.username;
        var filter = body.filter?.ToLower() ?? string.Empty;

        var allUsers = await database.Users.ToListAsync();
        var decryptedUsers = allUsers.Select(user => new
        {
            User = user,
            DecryptedUsername = encryptionHelper.Decrypt(user.Username).ToLower()
        }).ToList();

        var filteredUsers = decryptedUsers
            .Where(u => u.DecryptedUsername.Contains(filter) && u.DecryptedUsername != username.ToLower())
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

    [Authorize]
    [HttpGet("FriendshipState")]
    public async Task<IActionResult> GetFriendState(string friend1, string friend2)
    {
        string encryptedFriend1 = encryptionHelper.Encrypt(friend1);
        string encryptedFriend2 = encryptionHelper.Encrypt(friend2);

        var friendship = await database.Friends.SingleOrDefaultAsync(f =>
            (f.Friend1 == encryptedFriend1 && f.Friend2 == encryptedFriend2) ||
            (f.Friend1 == encryptedFriend2 && f.Friend2 == encryptedFriend1));

        if (friendship != null)
        {
            if (friendship.State == (int)FriendState.Friends)
            {
                return new APIResponse(200, null, FriendState.Friends);
            }
            if (friendship.Friend1 == encryptedFriend1 && friendship.State == (int)FriendState.FriendOneRequestSent)
            {
                return new APIResponse(200, null, FriendState.FriendOneRequestSent);
            }
            if (friendship.Friend1 == encryptedFriend2 && friendship.State == (int)FriendState.FriendTwoRequestSent)
            {
                return new APIResponse(200, null, FriendState.FriendTwoRequestSent);
            }
        }

        return APIResponse.NotFound;
    }

    [Authorize]
    [HttpPost("SendRequest")]
    public async Task<IActionResult> SendRequest(string originFriend, string newFriend)
    {
        string encryptedOriginFriend = encryptionHelper.Encrypt(originFriend);
        string encryptedNewFriend = encryptionHelper.Encrypt(newFriend);

        var originUser = await database.Users.SingleOrDefaultAsync(u => u.Username == encryptedOriginFriend);
        var newUser = await database.Users.SingleOrDefaultAsync(u => u.Username == encryptedNewFriend);

        if (originFriend == newFriend)
        {
            return APIResponse.BadRequest;
        }

        if (originUser == null || newUser == null)
        {
            return APIResponse.NotFound;
        }

        var friendship = await database.Friends
            .SingleOrDefaultAsync(f =>
                (f.Friend1 == encryptedOriginFriend && f.Friend2 == encryptedNewFriend) ||
                (f.Friend1 == encryptedNewFriend && f.Friend2 == encryptedOriginFriend));

        if (friendship == null)
        {
            Friendship newFriendship = new Friendship
            {
                Friend1 = encryptedOriginFriend,
                Friend2 = encryptedNewFriend,
                State = (int)FriendState.FriendOneRequestSent
            };

            await database.Friends.AddAsync(newFriendship);
            await database.SaveChangesAsync();
        }

        return APIResponse.Ok;
    }

    [Authorize]
    [HttpPost("AcceptRequest")]
    public async Task<IActionResult> AcceptRequest(string originFriend, string newFriend)
    {
        string encryptedOriginFriend = encryptionHelper.Encrypt(originFriend);
        string encryptedNewFriend = encryptionHelper.Encrypt(newFriend);

        var friendship = await database.Friends
            .SingleOrDefaultAsync(f =>
                f.Friend1 == encryptedOriginFriend && f.Friend2 == encryptedNewFriend);

        if (friendship == null)
        {
            return APIResponse.NotFound;
        }

        if (friendship.State == (int)FriendState.FriendOneRequestSent)
        {
            friendship.State = (int)FriendState.Friends;
            await database.SaveChangesAsync();
        }

        return APIResponse.Ok;
    }

    [Authorize]
    [HttpGet("RecentActivity")]
    public async Task<IActionResult> GetRecentActivity(string username)
    {
        string encryptedUsername = encryptionHelper.Encrypt(username);

        var friends = await database.Friends
            .Where(f => f.Friend1 == encryptedUsername || f.Friend2 == encryptedUsername)
            .Select(f => f.Friend1 == encryptedUsername ? f.Friend2 : f.Friend1)
            .ToListAsync();

        var friendWorkouts = await (from userWorkout in database.UserWorkouts
                                    join workout in database.Workouts on userWorkout.WId equals workout.WId
                                    join friend in database.Users on userWorkout.UId equals friend.UId
                                    where friends.Contains(friend.Username) && workout.date != null
                                    orderby workout.date descending
                                    select new
                                    {
                                        FriendUsername = encryptionHelper.Decrypt(friend.Username),
                                        WorkoutDate = workout.date,
                                        WorkoutName = workout.name,
                                        WorkoutDuration = workout.duration
                                    })
            .Take(10)
            .ToListAsync();

        return new APIResponse(200, null, friendWorkouts);
    }
}