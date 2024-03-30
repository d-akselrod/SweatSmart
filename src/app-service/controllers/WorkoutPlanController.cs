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
    public async Task<IActionResult> AddExercisesToWorkout(AddExercisesRequest request)
    {
        foreach (int id in request.exerciseIdList)
        {
            for (int set = 1; set <= 3; set++)
            {
                var workoutPlan = new WorkoutExercise
                {
                    WId = request.workoutId,
                    EId = id,
                    SetNumber = set,
                    Weight = 80,
                    Reps = 10,
                    PercentageOfOneRepMax = .875f
                };
                await database.WorkoutExercises.AddAsync(workoutPlan);
            }
        }

        await database.SaveChangesAsync();

        return APIResponse.Ok;
    }

    [Authorize]
    [HttpGet("{wid}")]
    public async Task<IActionResult> GetWorkoutPlan(string wid)
    {
        Guid guidWid = Guid.Parse(wid);
        var workoutPlan = await database.WorkoutPlans.Where(workoutPlan => workoutPlan.WId == guidWid).ToListAsync();

        if (!workoutPlan.Any())
        {
            return APIResponse.NotFound;
        }
        return new APIResponse(200, null, workoutPlan);
    }
}

