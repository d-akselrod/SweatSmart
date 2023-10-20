using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

public class FitnessGoals
{
    [Required]
    [Key]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Column("workoutFrequency", TypeName = "int")]
    public int WorkoutFrequency { get; set; }
}