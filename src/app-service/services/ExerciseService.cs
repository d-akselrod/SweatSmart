using App_Service.Database;
using App_Service.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App_Service.Services
{
    public class ExerciseService
    {
        private readonly DatabaseContext _context;

        public ExerciseService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Exercise>> GetAllExercisesAsync()
        {
            return await _context.Exercises.ToListAsync();
        }

        public async Task<Exercise> GetExerciseByIdAsync(Guid exerciseId)
        {
            return await _context.Exercises.FirstOrDefaultAsync(e => e.EId == exerciseId);
        }

        public async Task<Exercise> CreateExerciseAsync(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<Exercise> UpdateExerciseAsync(Guid exerciseId, Exercise updatedExercise)
        {
            var existingExercise = await _context.Exercises.FindAsync(exerciseId);
            if (existingExercise == null)
            {
                throw new InvalidOperationException("Exercise not found");
            }

            existingExercise.Name = updatedExercise.Name;
            existingExercise.MuscleGroup = updatedExercise.MuscleGroup;
            existingExercise.Level = updatedExercise.Level;
            existingExercise.U_L_C = updatedExercise.U_L_C;
            existingExercise.Equipment = updatedExercise.Equipment;

            _context.Entry(existingExercise).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingExercise;
        }

        public async Task DeleteExerciseAsync(Guid exerciseId)
        {
            var exercise = await _context.Exercises.FindAsync(exerciseId);
            if (exercise != null)
            {
                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();
            }
        }
    }
}
