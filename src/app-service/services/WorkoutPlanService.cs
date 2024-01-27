using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class WorkoutPlanService
{
    private readonly DatabaseContext _context;
    private readonly ExerciseService _exerciseService;
    private static readonly Random rnd = new Random();

    public WorkoutPlanService(DatabaseContext context, ExerciseService exerciseService)
    {
        _context = context;
        _exerciseService = exerciseService;
    }


    private async Task<Workout> GenerateWorkout(UserPreferences preferences, WorkoutType workoutType)
    {
        var exercises = await SelectExercisesForWorkout(preferences, workoutType);
        
        int sets = preferences.Goal == "strength" ? 3 : (preferences.Goal == "endurance" ? 4 : 3);
        int reps = preferences.Goal == "strength" ? 5 : (preferences.Goal == "endurance" ? 12 : 10);
        double percOneRM = 1 - 0.025 * reps; // Need to integrate this so it is displayed alongside sets and reps for each exercise. 

        int timePerRep = 3; // Time per rep in seconds
        int restBetweenSets = 60; // Rest between sets in seconds
        int totalWorkoutTime = 0;

        var workoutExercises = new List<WorkoutExercise>();

        foreach (var exercise in exercises)
        {
            int exerciseTime = CalculateExerciseTime(sets, reps, timePerRep, restBetweenSets);

            if (totalWorkoutTime + exerciseTime > preferences.TimeAvailable)
            {
                // If the exercise doesn't fit, try reducing sets
                while (sets > 0)
                {
                    exerciseTime = CalculateExerciseTime(sets, reps, timePerRep, restBetweenSets);
                    if (totalWorkoutTime + exerciseTime <= preferences.TimeAvailable) // time available needed in 
                    {
                        workoutExercises.Add(CreateWorkoutExercise(exercise, sets, reps));
                        totalWorkoutTime += exerciseTime;
                        break;
                    }
                    sets--;
                }
            }
            else
            {
                workoutExercises.Add(CreateWorkoutExercise(exercise, sets, reps));
                totalWorkoutTime += exerciseTime;
            }
        }

        var workout = new Workout
        {
            WId = Guid.NewGuid(), 
            WorkoutType = workoutType,
            duration = TimeSpan.FromMinutes(totalWorkoutTime)
        };

        return workout;
    }

        private int CalculateExerciseTime(int sets, int reps, int timePerRep, int restBetweenSets)
    {
        return (reps * timePerRep + restBetweenSets) * sets;
    }

    private WorkoutExercise CreateWorkoutExercise(Exercise exercise, int sets, int reps)
    {
        return new WorkoutExercise
        {
            ExerciseId = exercise.EId, 
            Sets = sets,
            Reps = reps
        };
    }
    
    private List<WorkoutType> DetermineWorkoutSplit(int frequency)
    {
        switch (frequency)
        {
            case 1: return new List<WorkoutType> { WorkoutType.TotalBody };
            case 2: return new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.TotalBody };
            case 3: return new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.TotalBody, WorkoutType.TotalBody };
            case 4: return new List<WorkoutType> { WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.TotalBody };
            case 5: return new List<WorkoutType> { WorkoutType.TotalBody, WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.TotalBody };
            case 6: return new List<WorkoutType> { WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower, WorkoutType.UpperPush, WorkoutType.UpperPull, WorkoutType.Lower };
            default: throw new ArgumentOutOfRangeException(nameof(frequency), "Frequency must be between 1 and 6");
        }
    }

    private async Task<IEnumerable<Exercise>> SelectExercisesForWorkout(UserPreferences preferences, WorkoutType workoutType)
    {
        var allExercises = await _exerciseService.GetAllExercisesAsync();

        // Depending on the workoutType, filter and select exercises
        List<Exercise> selectedExercises = workoutType switch
        {
            WorkoutType.TotalBody => SelectTotalBodyExercises(allExercises, preferences),
            WorkoutType.UpperPush => SelectUpperPushExercises(allExercises, preferences),
            WorkoutType.UpperPull => SelectUpperPullExercises(allExercises, preferences),
            WorkoutType.Lower => SelectLowerExercises(allExercises, preferences),
            _ => throw new ArgumentOutOfRangeException(nameof(workoutType), "Unsupported workout type")
        };

        return selectedExercises.Where(e => e != null); // Remove any null entries if an exercise was not found
    }

    private Exercise SelectExerciseByType(IEnumerable<Exercise> exercises, string ulcCategory, string ppCategory, string equipmentPreference, string experienceLevel)
    {
        // Filter exercises based on the U/L/C, P/P category, equipment availability, and experience level.
        var filteredExercises = exercises.Where(e =>
            (ppCategory == null || e.P_P == ppCategory) &&
            (equipmentPreference == "Full" ||
             equipmentPreference == "Dumbbells" && (e.Equipment == "D" || e.Equipment == "N") ||
             equipmentPreference == "None" && e.Equipment == "N") &&
            (experienceLevel == "A" ||
             experienceLevel == "I" && (e.Level == "I" || e.Level == "B") ||
             experienceLevel == "B" && e.Level == "B")).ToList();

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
        }.Where(e => e != null).ToList(); // Remove any null entries if an exercise was not found
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

    private List<Exercise> SelectExercisesByMuscleGroups(IEnumerable<Exercise> allExercises, UserPreferences preferences, Dictionary<string, int> muscleGroupCounts, string? movementType)
    {
        List<Exercise> selectedExercises = new List<Exercise>();

        foreach (var muscleGroup in muscleGroupCounts.Keys)
        {
            var exercisesForMuscleGroup = allExercises
                .Where(e => e.MuscleGroup == muscleGroup && 
                            (movementType == null || e.P_P == movementType) && 
                            (preferences.Equipment.HasFlag(Equipment.Parse(typeof(Equipment), e.Equipment)) || e.Equipment == "N") &&
                            (preferences.ExperienceLevel == "A" || 
                            preferences.ExperienceLevel == "I" && (e.Level == "I" || e.Level == "B") ||
                            preferences.ExperienceLevel == "B" && e.Level == "B"))
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

    [Authorize]
    [HttpPost("Test/{frequency}")]
    public IActionResult TestWorkoutSplit(int frequency)
    {
        try
        {
            var workoutTypes = DetermineWorkoutSplit(frequency);
            return Ok(new { Frequency = frequency, WorkoutTypes = workoutTypes });
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(ex.Message);
        }
    }

}

