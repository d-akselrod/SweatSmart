using System.Collections;
using App_Service.controllers;
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
    private readonly WorkoutPlanController workoutPlanController;

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
    [HttpPost("CreateWorkout")]
    public async Task<IActionResult> CreateWorkout(AddWorkoutRequest body)
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

        return new APIResponse(200, null, wId);
    }

    [Authorize]
    [HttpDelete("Workout")]
    public async Task<IActionResult> DeleteWorkout(Guid wId)
    {
        var userWorkout =
            await database.UserWorkouts.SingleOrDefaultAsync(userWorkout => userWorkout.WId == wId);

        if (userWorkout == null)
        {
            return APIResponse.NotFound;
        }

        var workoutExercises = await database.WorkoutExercises.Where(workoutExercise => workoutExercise.WId == wId).ToListAsync();
        database.WorkoutExercises.RemoveRange(workoutExercises);

        var workouts = await database.Workouts.Where(workout => workout.WId == wId).ToListAsync();
        database.Workouts.RemoveRange(workouts);

        database.UserWorkouts.Remove(userWorkout);

        database.SaveChangesAsync();

        return APIResponse.Ok;
    }

    [Authorize]
    [HttpDelete("DeleteExerciseFromWorkout")]
    public async Task<IActionResult> DeleteExerciseFromWorkout(Guid wId, int eId)
    {
        var exercise = await database.Exercises.SingleOrDefaultAsync(exercise => exercise.EId == eId);

        if (exercise == null)
        {
            return APIResponse.BadRequest;
        }

        var workoutExercise = await database.WorkoutExercises.Where(workoutExercise =>
            workoutExercise.EId == eId && workoutExercise.WId == wId).ToListAsync();

        if (workoutExercise.Count == 0)
        {
            return APIResponse.NotFound;
        }

        database.WorkoutExercises.RemoveRange(workoutExercise);
        database.SaveChangesAsync();
        return APIResponse.Ok;
    }

    [Authorize]
    [HttpPut("RenameWorkout")]
    public async Task<IActionResult> RenameWorkout(Guid wId, string newName)
    {
        var workout = await database.Workouts.SingleOrDefaultAsync(workout => workout.WId == wId);

        if (workout == null)
        {
            return APIResponse.NotFound;
        }

        workout.name = newName;

        await database.SaveChangesAsync();
        return APIResponse.Ok;
    }

    [Authorize]
    [HttpGet("GetExercises/{workoutId}")]
    public async Task<IActionResult> GetExercisesByWorkout(Guid workoutId)
    {
        // var workoutExercises = await database.WorkoutPlans.Where(w => w.WId == workoutId).ToListAsync();
        // var identifications = workoutExercises.Select(w => w.EId);
        // var exercises = await database.Exercises.Where(e => identifications.Contains(e.EId)).ToListAsync();
        // return new APIResponse(200, null, exercises);

        var workoutExists = await database.WorkoutExercises.AnyAsync(workout => workout.WId == workoutId);

        if (workoutExists == false)
        {
            return APIResponse.NotFound;
        }

        // var exercises = await (
        //     from workoutPlan in database.WorkoutPlans
        //     where workoutPlan.WId == workoutId
        //     join exercise in database.Exercises on workoutPlan.EId equals exercise.EId
        //     select new
        //     {
        //         ExerciseId = exercise.EId,
        //         MuscleGroup = exercise.MuscleGroup,
        //         ExerciseName = exercise.Name,
        //         TargetMuscle = exercise.TargetMuscle,
        //         level = exercise.Level,
        //         Sets = workoutPlan.Sets,
        //         Reps = workoutPlan.Reps
        //     }
        // ).ToListAsync();

        List<dynamic> exercises = new List<dynamic>();
        Dictionary<int, List<dynamic>> exerciseSets = new Dictionary<int, List<dynamic>>();

        foreach (WorkoutExercise workoutExercise in database.WorkoutExercises)
        {
            if (workoutId == workoutExercise.WId)
            {
                if (exerciseSets.Keys.Contains(workoutExercise.EId))
                {
                    exerciseSets[workoutExercise.EId].Add(new { reps = workoutExercise.Reps, weight = workoutExercise.Weight });
                }
                else
                {
                    exerciseSets[workoutExercise.EId] = new List<dynamic>();
                    exerciseSets[workoutExercise.EId].Add(new { reps = workoutExercise.Reps, weight = workoutExercise.Weight });
                }
            }
        }

        foreach (int key in exerciseSets.Keys)
        {
            var exercise = await database.Exercises.SingleAsync(e => e.EId == key);
            exercises.Add(new
            {
                eId = key,
                muscleGroup = exercise.MuscleGroup,
                exerciseName = exercise.Name,
                targetMuscle = exercise.TargetMuscle,
                level = exercise.Level,
                sets = exerciseSets[key]
            });
        }
        return new APIResponse(200, null, exercises);
    }

    [Authorize]
    [HttpGet("MuscleGroup/{muscleGroup}")]
    public async Task<IActionResult> GetExercisesByMuscleGroup(string muscleGroup)
    {
        var exercises = await database.Exercises.Where(exercise => exercise.MuscleGroup == muscleGroup).ToListAsync();
        return new APIResponse(200, null, exercises);
    }

    [Authorize]
    [HttpGet("CompletedWorkouts/{username}")]
    public async Task<IActionResult> GetCompletedWorkoutsByUser(string username)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));

        if (user == null)
        {
            return APIResponse.NotFound;
        }
        var userWorkouts = await database.UserWorkouts
            .Where(workout => workout.UId == user.UId && workout.Status == WorkoutStatus.Completed)
            .ToListAsync();

        var workoutIds = userWorkouts.Select(workout => workout.WId);

        var workouts = await database.Workouts
            .Where(workout => workoutIds.Contains(workout.WId))
            .OrderByDescending(workout => workout.date)
            .ToListAsync();

        return new APIResponse(200, null, workouts);
    }

    [Authorize]
    [HttpPost("CompleteWorkout")]
    public async Task<IActionResult> CompleteWorkout(string username, Guid wId)
    {
        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));

        if (user == null)
        {
            return new APIResponse(409, "User not found", null);
        }

        var userWorkout = await database.UserWorkouts.SingleOrDefaultAsync(workout => workout.UId == user.UId && workout.WId == wId);

        if (userWorkout == null)
        {
            return new APIResponse(409, "Workout not found", null);
        }

        userWorkout.Status = WorkoutStatus.Completed;

        await database.SaveChangesAsync();

        return APIResponse.Ok;
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> AddSet(Guid wId, int eId)
    {
        var workoutExercises = await database.WorkoutExercises.Where(we => we.WId == wId && we.EId == eId).ToListAsync();

        if (workoutExercises.Count == 0)
        {
            return APIResponse.NotFound;
        }

        var newWorkoutExercise = new WorkoutExercise
        {
            WId = wId,
            EId = eId,
            SetNumber = workoutExercises.Count + 1,
            Reps = 5,
            PercentageOfOneRepMax = 0.875f,
        };

        await database.WorkoutExercises.AddAsync(newWorkoutExercise);
        await database.SaveChangesAsync();
        return APIResponse.Ok;
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> RemoveSet(Guid wId, int eId, int setNum)
    {
        var workoutExercise = await database.WorkoutExercises.SingleOrDefaultAsync(we => we.WId == wId && we.EId == eId && we.SetNumber == setNum);

        if (workoutExercise == null)
        {
            return APIResponse.NotFound;
        }

        database.WorkoutExercises.Remove(workoutExercise);
        await database.SaveChangesAsync();
        return APIResponse.Ok;
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateSet(Guid wId, int eId, int setNum, int? newReps, int? newWeight)
    {
        var workoutExercise = await database.WorkoutExercises.SingleOrDefaultAsync(we => we.WId == wId && we.EId == eId && we.SetNumber == setNum);

        if (workoutExercise == null)
        {
            return APIResponse.NotFound;
        }

        workoutExercise.Reps = newReps ?? workoutExercise.Reps;
        workoutExercise.Weight = newWeight ?? workoutExercise.Weight;

        await database.SaveChangesAsync();
        return APIResponse.Ok;
    }
}