using App_Service.Controllers;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using App_Service.Typings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.services;

public record AddWorkoutRequest(string username, Workout workout);

[ApiController]
[Route("[controller]")]
public class WorkoutService : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly EncryptionHelper encryptionHelper;

    private readonly WorkoutController workoutController;
    private readonly UserController userController;
    private readonly UserWorkoutController userWorkoutController;

    public WorkoutService(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;
        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);

        workoutController = new WorkoutController(database);
        userWorkoutController = new UserWorkoutController(database);
    }

    [Authorize]
    [HttpGet("{username}")]
    public async Task<IActionResult> GetWorkoutsByUsername(string username)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));

        if (user == null)
        {
            return APIResponse.NotFound;
        }
        var userWorkouts = await database.UserWorkouts
            .Where(workout => workout.UId == user.UId)
            .ToListAsync();

        var workoutIds = userWorkouts.Select(workout => workout.WId);

        var workouts = await database.Workouts
            .Where(workout => workoutIds.Contains(workout.WId))
            .OrderByDescending(workout => workout.date)
            .ToListAsync();

        return new APIResponse(200, null, workouts);
    }

    [Authorize]
    [HttpPost("AddWorkout")]
    public async Task<IActionResult> AddWorkoutsByUsername(AddWorkoutRequest body)
    {
        var username = body.username;
        var workout = body.workout;

        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));
        if (user == null)
        {
            return APIResponse.NotFound;
        }

        var wId = Guid.NewGuid();

        workout.WId = wId;

        var userWorkout = new UserWorkout
        {
            WId = wId,
            UId = user.UId,
            Status = 0
        };

        await workoutController.AddWorkout(workout);
        await userWorkoutController.AddUserWorkout(userWorkout);

        return new APIResponse(200, null, null);
    }

    [Authorize]
    [HttpGet("MuscleGroup/{muscleGroup}")]
    public async Task<IActionResult> GetExercisesByMuscleGroup(string muscleGroup)
    {
        var exercises = await database.Exercises.Where(exercise => exercise.MuscleGroup == muscleGroup).ToListAsync();
        return new APIResponse(200, null, exercises);
    }
}