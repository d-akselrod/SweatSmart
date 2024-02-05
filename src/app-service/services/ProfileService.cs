using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using App_Service.Typings;

namespace App_Service.services;

public record UserPreferencesRequest(PersonalGoal goal, ExperienceLevel experienceLevel, int frequency, EquipmentAvailable equipment, int timeAvailable);

[ApiController]
[Route("[controller]")]
public class ProfileService : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly EncryptionHelper encryptionHelper;

    public ProfileService(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;

        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);
    }

    [Authorize]
    [HttpPost("UserPreferences")]
    public async Task<IActionResult> UpdateUserPreferences(string username, UserPreferencesRequest body)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));

        if (user == null)
        {
            return APIResponse.NotFound;
        }

        var originalPreferences = await database.UserPreferences.SingleOrDefaultAsync(preference => preference.UId == user.UId);

        if (originalPreferences != null)
        {
            database.UserPreferences.Remove(originalPreferences);
        }

        var newPreferences = new UserPreferences()
        {
            UId = user.UId,
            Goal = body.goal,
            ExperienceLevel = body.experienceLevel,
            Frequency = body.frequency,
            Equipment = body.equipment,
            TimeAvailable = body.timeAvailable
        };

        await database.UserPreferences.AddAsync(newPreferences);

        await database.SaveChangesAsync();

        return APIResponse.Ok;
    }
}