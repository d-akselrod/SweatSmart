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

        int sets = preferences.Goal == PersonalGoal.strength ? 3 : 4;
        int reps = preferences.Goal == PersonalGoal.strength ? 5 : (preferences.Goal == PersonalGoal.endurance ? 12 : 10);

        float percOneRM = (float)(1 - 0.025 * reps); // Need to integrate this so it is displayed alongside sets and reps for each exercise. 

        int timePerRep = 3;
        int restBetweenSets = 60;
        int restBetweenExercises = 60 * 5;
        int totalWorkoutTime = 0;

        var workoutExercises = new List<WorkoutPlan>();
        Guid WId = Guid.NewGuid();

        foreach (var exercise in exercises)
        {
            int exerciseTime = CalculateExerciseTime(sets, reps, timePerRep, restBetweenSets, restBetweenExercises);

            var workoutExercise = new WorkoutPlan
            {
                WId = WId,
                EId = exercise.EId,
                Sets = sets,
                Reps = reps,
                PercentageOfOneRepMax = percOneRM
            };

            if (totalWorkoutTime + exerciseTime > preferences.TimeAvailable * 60)
            {
                while (workoutExercise.Sets > 0)
                {
                    exerciseTime = CalculateExerciseTime(workoutExercise.Sets, reps, timePerRep, restBetweenSets, restBetweenExercises);

                    if (totalWorkoutTime + exerciseTime <= preferences.TimeAvailable * 60)
                    {
                        workoutExercises.Add(workoutExercise);
                        totalWorkoutTime += exerciseTime;
                        break;
                    }
                    workoutExercise.Sets--;
                }
            }
            else
            {
                workoutExercises.Add(workoutExercise);
                totalWorkoutTime += exerciseTime;
            }
        }

        var newWorkout = new Workout
        {
            WId = WId,
            name = workoutType.ToString(),
            date = DateTime.Now,
            duration = totalWorkoutTime
        };

        await database.Workouts.AddAsync(newWorkout);
        await database.SaveChangesAsync();

        var workout = new UserWorkout
        {
            WId = WId,
            UId = user.UId,
            Status = WorkoutStatus.NotStarted,
        };

        await database.UserWorkout.AddAsync(workout);
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
            database.WorkoutPlans.Add(workoutPlan);
        }

        await database.SaveChangesAsync();


        return new APIResponse(200, null, workoutExercises);
    }

    private int CalculateExerciseTime(int sets, int reps, int timePerRep, int restBetweenSets, int restBetweenExercises)
    {
        return (reps * timePerRep + restBetweenSets) * sets + restBetweenExercises;
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
    //make sure this is correct for pulling from the database
    private Exercise SelectExerciseByType(IEnumerable<Exercise> exercises, char ulcCategory, string ppCategory, EquipmentAvailable equipmentPreference, ExperienceLevel experienceLevel)
    {
        // Filter exercises based on the U/L/C, P/P category, equipment availability, and experience level.
        var filteredExercises = exercises.Where(e =>
            (e.U_L_C == ulcCategory) &&
            (e.P_P == ppCategory) &&
            (equipmentPreference == EquipmentAvailable.Full ||
             equipmentPreference == EquipmentAvailable.Dumbbells && (e.Equipment == 'D' || e.Equipment == 'N') ||
             equipmentPreference == EquipmentAvailable.None && e.Equipment == 'N') &&
            (experienceLevel == ExperienceLevel.Advanced ||
             experienceLevel == ExperienceLevel.Intermediate && (e.Level == 'I' || e.Level == 'B') ||
             experienceLevel == ExperienceLevel.Beginner && e.Level == 'B')).ToList();

        // Select a random exercise from the filtered list
        return filteredExercises.Any() ? filteredExercises[rnd.Next(filteredExercises.Count)] : null;
    }

    private List<Exercise> SelectTotalBodyExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        // Select a balanced mix of exercises covering Upper, Lower, and Core with both Push and Pull movements
        return new List<Exercise>
        {
            SelectExerciseByType(allExercises, 'U', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'C', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'C', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'C', "Push", preferences.Equipment, preferences.ExperienceLevel),
        }.Where(e => e != null).ToList();
    }

    private List<Exercise> SelectLowerExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        // Focus on leg exercises that are either push or pull
        return new List<Exercise>
        {
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel)
        }.Where(e => e != null).ToList(); // Remove any null entries if an exercise was not found
    }

    //this method just doesnt work as intended
    private List<Exercise> SelectExercisesByMuscleGroups(IEnumerable<Exercise> allExercises, UserPreferences preferences, Dictionary<string, int> muscleGroupCounts, string movementType)
    {
        List<Exercise> selectedExercises = new List<Exercise>();
        HashSet<Guid> selectedExerciseIds = new HashSet<Guid>(); // Track selected exercise IDs

        // While there are still exercises to be selected
        while (muscleGroupCounts.Any(kvp => kvp.Value > 0))
        {
            foreach (var muscleGroup in muscleGroupCounts.Keys.ToList())
            {
                // Skip this muscle group if no more exercises are needed for it
                if (muscleGroupCounts[muscleGroup] == 0)
                    continue;

                var exercisesForMuscleGroup = allExercises
                    .Where(e => e.MuscleGroup == muscleGroup &&
                                !selectedExerciseIds.Contains(e.EId) && // Exclude already selected exercises
                                (movementType == null || e.P_P == movementType) &&
                                (preferences.Equipment == EquipmentAvailable.Full ||
                                preferences.Equipment == EquipmentAvailable.Dumbbells && e.Equipment == 'D' ||
                                preferences.Equipment == EquipmentAvailable.None && e.Equipment == 'N') &&
                                (preferences.ExperienceLevel == ExperienceLevel.Advanced && e.Level == 'A') ||
                                preferences.ExperienceLevel == ExperienceLevel.Intermediate && e.Level == 'I' ||
                                preferences.ExperienceLevel == ExperienceLevel.Beginner && e.Level == 'B')
                    .OrderBy(x => rnd.Next()) // Randomly shuffle the exercises
                    .FirstOrDefault(); // Take only one exercise

                if (exercisesForMuscleGroup != null)
                {
                    selectedExercises.Add(exercisesForMuscleGroup);
                    selectedExerciseIds.Add(exercisesForMuscleGroup.EId); // Add to the set of selected IDs
                    muscleGroupCounts[muscleGroup]--; // Decrement the count for this muscle group
                }
            }
        }

        return selectedExercises;
    }



    // only returning one exercise each for some reason.
    private List<Exercise> SelectUpperPushExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        return SelectExercisesByMuscleGroups(allExercises, preferences, new Dictionary<string, int>
        {
            { "Chest", 8 },
            { "Shoulders", 4 },
            { "Triceps", 4 }
        }, "Push");
    }

    private List<Exercise> SelectUpperPullExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        return SelectExercisesByMuscleGroups(allExercises, preferences, new Dictionary<string, int>
        {
            { "Back", 8 },
            { "Biceps", 8 } // basically no beginner+no equipment options, my need to display disclaimer for User with those preferences
        }, "Pull");
    }
}

