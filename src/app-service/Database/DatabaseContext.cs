using Microsoft.EntityFrameworkCore;
using App_Service.Models;

namespace App_Service.Database;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<PhysicalAttributes> PhysicalAttributes { get; set; }


    public DbSet<Workout> Workouts { get; set; }

    public DbSet<Exercise> Exercises { get; set; }

    public DbSet<UserWorkout> UserWorkouts { get; set; }

    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }

    public DbSet<FitnessGoals> FitnessGoals { get; set; }
}