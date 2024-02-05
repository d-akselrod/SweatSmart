using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]
public class UserWorkoutController : ControllerBase
{
    private readonly DatabaseContext database;

    public UserWorkoutController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUserWorkouts()
    {
        var workouts = await database.UserWorkouts.ToListAsync();
        return Ok(workouts);
    }

    [Authorize]
    [HttpGet("{username}")]
    public async Task<IActionResult> GetSingleUserWorkouts(string username)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == username);

        if (user == null)
        {
            return NotFound();
        }

        var workouts = await database.UserWorkouts.Where(userWorkout => userWorkout.UId == user.UId).ToListAsync();
        return Ok(workouts);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddUserWorkout(UserWorkout userWorkout)
    {
        await database.UserWorkouts.AddAsync(userWorkout);
        await database.SaveChangesAsync();
        return Ok(userWorkout);
    }

    [Authorize]
    [HttpDelete("{wid}")]
    public async Task<IActionResult> GetUserWorkoutByWID(Guid wid)
    {
        var userWorkout = await database.UserWorkouts.FindAsync(wid);

        if (userWorkout == null)
        {
            return NotFound();
        }

        return Ok(userWorkout);
    }
}