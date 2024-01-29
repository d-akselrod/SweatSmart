using App_Service.Database;
using App_Service.Models;
using App_Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App_Service.Typings;
using Microsoft.EntityFrameworkCore;

public record GenerateWorkoutRequest(string username, WorkoutType workoutType);

[ApiController]
[Route("[controller]")]
public class WorkoutPlannerService : ControllerBase
{
    private readonly DatabaseContext database;
    private readonly ExerciseController exerciseController;
    private readonly EncryptionHelper encryptionHelper;
    private static readonly Random rnd = new Random();

    public WorkoutPlannerService(DatabaseContext database, IConfiguration configuration)
    {
        this.database = database;
        exerciseController = new ExerciseController(database);

        var encryptionKey = configuration["EncryptionKey"];
        encryptionHelper = new EncryptionHelper(encryptionKey);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> GenerateWorkout(GenerateWorkoutRequest body)
    {
        var username = body.username;
        var workoutType = body.workoutType;

        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));
        if (user == null)
        {
            return APIResponse.NotFound;
        }

        var preferences = await database.UserPreferences.SingleOrDefaultAsync(userPreferences => userPreferences.UId == user.UId);
        if (preferences == null)
        {
            return APIResponse.NotFound;
        }

        var exercises = await SelectExercisesForWorkout(preferences, workoutType);

        int sets = preferences.Goal == PersonalGoal.endurance ? 4 : 3;
        int reps = preferences.Goal == PersonalGoal.strength ? 5 : (preferences.Goal == PersonalGoal.endurance ? 12 : 10);

        float percOneRM = (float)(1 - 0.025 * reps); // Need to integrate this so it is displayed alongside sets and reps for each exercise. 

        int timePerRep = 3; // Time per rep in seconds
        int restBetweenSets = 60; // Rest between sets in seconds
        int totalWorkoutTime = 0;

        var workoutExercises = new List<WorkoutPlan>();

        foreach (var exercise in exercises)
        {
            int exerciseTime = CalculateExerciseTime(sets, reps, timePerRep, restBetweenSets);

            var workoutExercise = new WorkoutPlan
            {
                EId = exercise.EId,
                Sets = sets,
                Reps = reps,
                PercentageOfOneRepMax = percOneRM
            };

            if (totalWorkoutTime + exerciseTime > preferences.TimeAvailable)
            {
                while (sets > 0)
                {
                    exerciseTime = CalculateExerciseTime(sets, reps, timePerRep, restBetweenSets);
                    if (totalWorkoutTime + exerciseTime <= preferences.TimeAvailable)
                    {
                        workoutExercises.Add(workoutExercise);
                        totalWorkoutTime += exerciseTime;
                        break;
                    }
                    sets--;
                }
            }
            else
            {
                workoutExercises.Add(workoutExercise);
                totalWorkoutTime += exerciseTime;
            }
        }

        Guid WId = Guid.NewGuid();

        var newWorkout = new Workout
        {
            WId = WId,
            name = workoutType.ToString(),
            date = DateTime.Now, 
            duration = totalWorkoutTime 
        };

        database.Workouts.Add(newWorkout);
        await database.SaveChangesAsync();

        var workout = new UserWorkout
        {
            WId = WId,
            UId = user.UId,
            Status = WorkoutStatus.NotStarted,
        };

        database.UserWorkout.Add(workout);
        await database.SaveChangesAsync();

        foreach (var exercise in workoutExercises)
        {
            var workoutPlan = new WorkoutPlan
            {
                WId = WId,
                EId = exercise.EId,
                Sets = exercise.Sets,
                Reps = exercise.Reps,
                PercentageOfOneRepMax = percOneRM
            };

            // Check if the entity is already being tracked
            var existingWorkoutPlan = database.WorkoutPlans.Find(workoutPlan.WId, workoutPlan.EId);
            if (existingWorkoutPlan == null)
            {
                // If it's not being tracked, add it
                database.WorkoutPlans.Add(workoutPlan);
            }
            else
            {
                // If it is being tracked, update the necessary fields
                existingWorkoutPlan.Sets = workoutPlan.Sets;
                existingWorkoutPlan.Reps = workoutPlan.Reps;
                existingWorkoutPlan.PercentageOfOneRepMax = workoutPlan.PercentageOfOneRepMax;
                database.Entry(existingWorkoutPlan).State = EntityState.Modified;
            }
        }

        await database.SaveChangesAsync();


        return new APIResponse(200, null, workoutExercises);
    }

    private int CalculateExerciseTime(int sets, int reps, int timePerRep, int restBetweenSets)
    {
        return (reps * timePerRep + restBetweenSets) * sets;
    }

    private List<WorkoutType> DetermineWorkoutSplit(int frequency)
    {
        List<WorkoutType> workoutSplit = null;

        switch (frequency)
        {
            case 1:
                workoutSplit = new List<WorkoutType> { WorkoutType.TotalBody };
                break;
            case 2:
                workoutSplit = new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.TotalBody };
                break;
            case 3:
                workoutSplit = new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.TotalBody, WorkoutType.TotalBody };
                break;
            case 4:
                workoutSplit = new List<WorkoutType> { WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.TotalBody };
                break;
            case 5:
                workoutSplit = new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.TotalBody };
                break;
            case 6:
                workoutSplit = new List<WorkoutType> { WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower };
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(frequency), "Frequency must be between 1 and 6");
        }

        return workoutSplit;
    }

    private async Task<IEnumerable<Exercise>> SelectExercisesForWorkout(UserPreferences preferences, WorkoutType workoutType)
    {
        var allExercises = await database.Exercises.AsNoTracking().ToListAsync();

        // Depending on the workoutType, filter and select exercises
        List<Exercise> selectedExercises = workoutType switch
        {
            WorkoutType.TotalBody => SelectTotalBodyExercises(allExercises, preferences),
            WorkoutType.UpperPush => SelectUpperPushExercises(allExercises, preferences),
            WorkoutType.UpperPull => SelectUpperPullExercises(allExercises, preferences),
            WorkoutType.Lower => SelectLowerExercises(allExercises, preferences),
            _ => new List<Exercise>()
        };

        return selectedExercises;
    }

    private Exercise SelectExerciseByType(IEnumerable<Exercise> exercises, string ulcCategory, string ppCategory, EquipmentAvailable equipmentPreference, ExperienceLevel experienceLevel)
    {
        // Filter exercises based on the U/L/C, P/P category, equipment availability, and experience level.
        var filteredExercises = exercises.Where(e =>
            (ppCategory == null || e.P_P == ppCategory) &&
            (equipmentPreference == EquipmentAvailable.Full ||
             equipmentPreference == EquipmentAvailable.Dumbbells && (e.Equipment == "D" || e.Equipment == "N") ||
             equipmentPreference == EquipmentAvailable.None && e.Equipment == "N") &&
            (experienceLevel == ExperienceLevel.Advanced ||
             experienceLevel == ExperienceLevel.Intermediate && (e.Level == "I" || e.Level == "B") ||
             experienceLevel == ExperienceLevel.Beginner && e.Level == "B")).ToList();

        // Select a random exercise from the filtered list
        return filteredExercises.Any() ? filteredExercises[rnd.Next(filteredExercises.Count)] : null;
    }

    private List<Exercise> SelectTotalBodyExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        // Select a balanced mix of exercises covering Upper, Lower, and Core with both Push and Pull movements
        return new List<Exercise>
        {
            SelectExerciseByType(allExercises, "U", "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "U", "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "L", "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "L", "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "C", null, preferences.Equipment, preferences.ExperienceLevel) // Core exercises
        }.Where(e => e != null).ToList();
    }

    private List<Exercise> SelectLowerExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        // Focus on leg exercises that are either push or pull
        return new List<Exercise>
        {
            SelectExerciseByType(allExercises, "L", "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "L", "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "L", "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, "L", "Pull", preferences.Equipment, preferences.ExperienceLevel)
        }.Where(e => e != null).ToList(); // Remove any null entries if an exercise was not found
    }

    private List<Exercise> SelectExercisesByMuscleGroups(IEnumerable<Exercise> allExercises, UserPreferences preferences, Dictionary<string, int> muscleGroupCounts, string movementType)
    {
        List<Exercise> selectedExercises = new List<Exercise>();

        foreach (var muscleGroup in muscleGroupCounts.Keys)
        {
            var exercisesForMuscleGroup = allExercises
                .Where(e => e.MuscleGroup == muscleGroup &&
                            (movementType == null || e.P_P == movementType) &&
                            (preferences.Equipment == EquipmentAvailable.Full ||
                            preferences.Equipment == EquipmentAvailable.Dumbbells && e.Equipment.Contains("D") ||
                            preferences.Equipment == EquipmentAvailable.None && e.Equipment.Contains("N")) &&
                            (preferences.ExperienceLevel == ExperienceLevel.Advanced && e.Level.Contains("A") ||
                            preferences.ExperienceLevel == ExperienceLevel.Intermediate && e.Level.Contains("I") ||
                            preferences.ExperienceLevel == ExperienceLevel.Beginner && e.Level.Contains("B")))
                .ToList();

            // Randomly shuffle the exercises for the muscle group to provide variety
            Random rnd = new Random();
            exercisesForMuscleGroup = exercisesForMuscleGroup.OrderBy(x => rnd.Next()).ToList();

            // Add the required number of exercises for this muscle group to the selected exercises
            selectedExercises.AddRange(exercisesForMuscleGroup.Take(muscleGroupCounts[muscleGroup]));
        }

        return selectedExercises;
    }

    private List<Exercise> SelectUpperPushExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        return SelectExercisesByMuscleGroups(allExercises, preferences, new Dictionary<string, int>
        {
            { "Chest - Pectoralis", 2 },
            { "Shoulders - Delts/Traps", 1 },
            { "Triceps", 1 }
        }, "Push");
    }

    private List<Exercise> SelectUpperPullExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        return SelectExercisesByMuscleGroups(allExercises, preferences, new Dictionary<string, int>
        {
            { "Back - Latissimus Dorsi", 1 },
            { "Back - Lat.Dorsi/Rhomboids", 1 },
            { "Bicep", 2 }
        }, "Pull");
    }
}

