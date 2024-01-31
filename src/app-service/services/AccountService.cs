using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
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
    private readonly EncryptionHelper encryptionHelper;

    public AccountService(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;
        userController = new UserController(database);

        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);
    }

    private string HashPassword(string password)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            string hashedPassword = BitConverter.ToString(bytes).Replace("-", "").ToLower();
            return hashedPassword;
        }
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
            ? await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username))
            : await database.Users.SingleOrDefaultAsync(user => user.Email == encryptionHelper.Encrypt(email));

        if (user == null)
        {
            return new APIResponse(404, "Account not found", null);
        }

        if (HashPassword(password) == user.Password)
        {
            var decryptedUser = new User
            {
                Name = !string.IsNullOrEmpty(user.Name) ? encryptionHelper.Decrypt(user.Name) : null,
                Email = user.Email != null ? encryptionHelper.Decrypt(user.Email) : null,
                Username = user.Username != null ? encryptionHelper.Decrypt(user.Username) : null,
            };
            return new APIResponse(200, null, decryptedUser);
        }
        return new APIResponse(401, "Incorrect Password", null);
    }

    [Authorize]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegisterRequest body)
    {
        var username = body.Username;
        var email = body.Email;
        var password = body.Password;

        if (await database.Users.AnyAsync(user => user.Email == encryptionHelper.Encrypt(email)))
        {
            return new APIResponse(409, "Email already exists", null);
        }

        if (await database.Users.AnyAsync(user => user.Username == encryptionHelper.Encrypt(username)))
        {
            return new APIResponse(409, "Username already exists", null);
        }

        var decryptedUser = new User
        {
            Email = email,
            Username = username,
        };

        var encryptedUser = new User
        {
            Email = encryptionHelper.Encrypt(email),
            Username = encryptionHelper.Encrypt(username),
            Password = HashPassword(password)
        };

        await userController.AddUser(encryptedUser);
        return new APIResponse(200, null, decryptedUser);
    }
}