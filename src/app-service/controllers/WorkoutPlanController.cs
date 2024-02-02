using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using App_Service.services;
using App_Service.Typings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.controllers;

public record AddExercisesRequest(List<int> exerciseIdList, Guid workoutId);

[ApiController]
[Route("[controller]")]
public class WorkoutPlanController : ControllerBase
{
    private readonly DatabaseContext database;

    public WorkoutPlanController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddExercisesToWorkout(List<int> exerciseIdList, Guid workoutId)
    {
        var workoutPlans = exerciseIdList.Select(id => new WorkoutPlan
        {
            WId = workoutId,
            EId = id,
            Sets = 3,
            Reps = 10,
            PercentageOfOneRepMax = 0
        });

        await database.WorkoutPlans.AddRangeAsync(workoutPlans);
        await database.SaveChangesAsync();

        return new APIResponse(200, null, null);
    }
}