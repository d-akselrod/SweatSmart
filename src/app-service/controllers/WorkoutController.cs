using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]

public class WorkoutController : ControllerBase
{
    private readonly DatabaseContext database;

    public WorkoutController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetWorkouts()
    {
        var workouts = await database.Workouts.ToListAsync();
        return Ok(workouts);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddWorkout(Workout newWorkout)
    {
        await database.Workouts.AddAsync(newWorkout);
        await database.SaveChangesAsync();

        return Ok(newWorkout);
    }
}