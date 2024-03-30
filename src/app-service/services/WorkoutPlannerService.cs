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

public record GenerateWorkoutPlanRequest(string username, int frequency);

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
    [HttpPost("SingularWorkout")]
    public async Task<IActionResult> GenerateSingularWorkout(GenerateWorkoutRequest body)
    {
        var username = body.username;
        var user = await database.Users.SingleOrDefaultAsync(u => encryptionHelper.Encrypt(username) == u.Username);

        if (user == null)
        {
            return APIResponse.NotFound;
        }

        var workoutExercises = await GenerateWorkout(body);

        if (workoutExercises == null || workoutExercises.Count == 0)
        {
            return APIResponse.NotFound;
        }

        return new APIResponse(200, null, workoutExercises);
    }

    [Authorize]
    [HttpPost("WeeklyWorkoutPlan")]
    public async Task<IActionResult> GenerateWorkoutPlan(GenerateWorkoutPlanRequest body)
    {
        var username = body.username;
        var frequency = body.frequency;

        var user = await database.Users.SingleOrDefaultAsync(u => encryptionHelper.Encrypt(username) == u.Username);

        if (user == null)
        {
            return APIResponse.NotFound;
        }

        var workoutSplit = DetermineWorkoutSplit(frequency);

        var weeklyWorkoutPlan = new List<List<WorkoutPlan>>();

        foreach (var workoutType in workoutSplit)
        {
            var workoutPlan = await GenerateWorkout(new GenerateWorkoutRequest(username, workoutType));
            weeklyWorkoutPlan.Add(workoutPlan);
        }

        return new APIResponse(200, null, weeklyWorkoutPlan);
    }

    private async Task<List<WorkoutPlan>> GenerateWorkout(GenerateWorkoutRequest body)
    {
        var username = body.username;
        var workoutType = body.workoutType;

        var user = await database.Users.SingleOrDefaultAsync(user => user.Username == encryptionHelper.Encrypt(username));
        if (user == null)
        {
            return null; // Handle not found case appropriately
        }

        var preferences = await database.UserPreferences.SingleOrDefaultAsync(userPreferences => userPreferences.UId == user.UId);
        if (preferences == null)
        {
            return null; // Handle not found case appropriately
        }

        var exercises = await SelectExercisesForWorkout(preferences, workoutType);

        int sets = preferences.Goal == PersonalGoal.strength ? 3 : 4;
        int reps = preferences.Goal == PersonalGoal.strength ? 5 : (preferences.Goal == PersonalGoal.endurance ? 12 : 10);
        float percOneRM = (float)(1 - 0.025 * reps);

        int timePerRep = 3;
        int restBetweenSets = 60;
        int restBetweenExercises = 60 * 5;
        int totalWorkoutTime = 0;
        Guid WId = Guid.NewGuid();

        var workoutExercises = new List<WorkoutPlan>();

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

        string workoutName;
        switch (workoutType)
        {
            case WorkoutType.TotalBody:
                workoutName = "Total Body";
                break;
            case WorkoutType.UpperPush:
                workoutName = "Upper Body Push";
                break;
            case WorkoutType.UpperPull:
                workoutName = "Upper Body Pull";
                break;
            case WorkoutType.Lower:
                workoutName = "Lower Body";
                break;
            default:
                workoutName = "Workout";
                break;
        }

        var newWorkout = new Workout
        {
            WId = WId,
            name = workoutName,
            date = DateTime.Now,
            duration = totalWorkoutTime,
            isGenerated = 1
        };

        await database.Workouts.AddAsync(newWorkout);
        await database.SaveChangesAsync();

        var workout = new UserWorkout
        {
            WId = WId,
            UId = user.UId,
            Status = WorkoutStatus.NotStarted,
        };

        await database.UserWorkouts.AddAsync(workout);
        await database.SaveChangesAsync();

        foreach (var exercise in workoutExercises)
        {
            for (int set = 1; set <= exercise.Sets; set++)
            {
                var workoutExercise = new WorkoutExercise
                {
                    WId = WId,
                    EId = exercise.EId,
                    SetNumber = set,
                    Reps = exercise.Reps,
                    Weight = 80,
                    PercentageOfOneRepMax = percOneRM
                };

                await database.WorkoutExercises.AddAsync(workoutExercise);
            }
        }

        await database.SaveChangesAsync();
        return workoutExercises;
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
        List<Exercise> exercises = new List<Exercise>();
        List<Exercise> exercisesToAdd = new List<Exercise>
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
            SelectExerciseByType(allExercises, 'U', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'C', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'U', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Push", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'L', "Pull", preferences.Equipment, preferences.ExperienceLevel),
            SelectExerciseByType(allExercises, 'C', "Push", preferences.Equipment, preferences.ExperienceLevel),
        }.Where(e => e != null).ToList(); // Remove any null entries if an exercise was not found
        foreach (var e in exercisesToAdd)
        {
            if (!exercises.Contains(e))
            {
                exercises.Add(e);
            }
        }
        return exercises;
    }

    private List<Exercise> SelectLowerExercises(IEnumerable<Exercise> allExercises, UserPreferences preferences)
    {
        List<Exercise> exercises = new List<Exercise>();
        List<Exercise> exercisesToAdd = new List<Exercise>
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
        foreach (var e in exercisesToAdd)
        {
            if (!exercises.Contains(e))
            {
                exercises.Add(e);
            }
        }
        return exercises;
    }

    //this method just doesnt work as intended
    private List<Exercise> SelectExercisesByMuscleGroups(IEnumerable<Exercise> allExercises, UserPreferences preferences, Dictionary<string, int> muscleGroupCounts, string movementType)
    {
        List<Exercise> selectedExercises = new List<Exercise>();
        Random rng = new Random();

        // Create a list of queues, one for each muscle group
        List<Queue<Exercise>> exerciseQueues = new List<Queue<Exercise>>();
        foreach (var muscleGroup in muscleGroupCounts.Keys.ToList())
        {
            // Get all exercises for this muscle group that meet the criteria
            var exercisesForMuscleGroup = allExercises
                .Where(e => e.MuscleGroup == muscleGroup &&
                            (movementType == null || e.P_P == movementType) &&
                            (preferences.Equipment == EquipmentAvailable.Full ||
                            preferences.Equipment == EquipmentAvailable.Dumbbells && e.Equipment == 'D' ||
                            preferences.Equipment == EquipmentAvailable.None && e.Equipment == 'N'))
                .ToList();

            // Shuffle the exercises
            int n = exercisesForMuscleGroup.Count();
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                var value = exercisesForMuscleGroup[k];
                exercisesForMuscleGroup[k] = exercisesForMuscleGroup[n];
                exercisesForMuscleGroup[n] = value;
            }

            // Add the shuffled exercises to the queue
            exerciseQueues.Add(new Queue<Exercise>(exercisesForMuscleGroup));
        }

        // While there are still exercises needed, remove one exercise from each queue in turn
        bool exercisesRemaining = true;
        while (exercisesRemaining)
        {
            exercisesRemaining = false;
            for (int i = 0; i < exerciseQueues.Count; i++)
            {
                if (muscleGroupCounts[muscleGroupCounts.Keys.ToList()[i]] > 0 && exerciseQueues[i].Count > 0)
                {
                    selectedExercises.Add(exerciseQueues[i].Dequeue());
                    muscleGroupCounts[muscleGroupCounts.Keys.ToList()[i]]--;
                    exercisesRemaining = true;
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