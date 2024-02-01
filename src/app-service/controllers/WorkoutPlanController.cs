using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using App_Service.services;
using App_Service.Typings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.controllers;

public record AddExerciseRequest(int exerciseId, Guid workoutId);

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
    public async Task<IActionResult> AddExerciseToWorkout(AddExerciseRequest body)
    {
        var workoutPlan = new WorkoutPlan
        {
            WId = body.workoutId,
            EId = body.exerciseId,
            Sets = 3,
            Reps = 10,
            PercentageOfOneRepMax = 0
        };
        await database.WorkoutPlans.AddAsync(workoutPlan);
        await database.SaveChangesAsync();

        return new APIResponse(200, null, workoutPlan);
    }
}