using App_Service.Database;
using App_Service.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App_Service.Services;

[ApiController]
[Route("[controller]")]
public class ExerciseController : ControllerBase
{
    private readonly DatabaseContext database;

    public ExerciseController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllExercises()
    {
        var exercises = await database.Exercises.ToListAsync();
        return Ok(exercises);
    }

    [Authorize]
    [HttpGet("{exerciseId}")]
    public async Task<IActionResult> GetExerciseById(int exerciseId)
    {
        var exercise = await database.Exercises.SingleOrDefaultAsync(exercise => exercise.EId == exerciseId);
        if (exercise == null)
        {
            return NotFound();
        }
        return Ok();
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddExercise(Exercise exercise)
    {
        database.Exercises.AddAsync(exercise);
        await database.SaveChangesAsync();
        return Ok();
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateExercise(Exercise updatedExercise)
    {
        var existingExercise =
            await database.Exercises.SingleOrDefaultAsync(exercise => exercise.EId == updatedExercise.EId);

        if (existingExercise == null)
        {
            return NotFound();
        }

        existingExercise.Name = updatedExercise.Name;
        existingExercise.MuscleGroup = updatedExercise.MuscleGroup;
        existingExercise.Level = updatedExercise.Level;
        existingExercise.U_L_C = updatedExercise.U_L_C;
        existingExercise.Equipment = updatedExercise.Equipment;
        existingExercise.P_P = updatedExercise.P_P;

        database.Exercises.Remove(existingExercise);
        await database.SaveChangesAsync();

        database.AddAsync(updatedExercise);
        await database.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpDelete("{exerciseId}")]
    public async Task<IActionResult> DeleteExercise(int exerciseId)
    {
        var exercise = await database.Exercises.SingleOrDefaultAsync(exercise => exercise.EId == exerciseId);

        if (exercise == null)
        {
            return NotFound();
        }

        database.Exercises.Remove(exercise);
        await database.SaveChangesAsync();
        return Ok();
    }
}
