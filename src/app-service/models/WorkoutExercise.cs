using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;
[Table("WorkoutExercises")]
public class WorkoutExercise
{
    [Key]
    [Required]
    [Column("wID", TypeName = "UniqueIdentifier")]
    public Guid WId { get; set; }

    [Key]
    [Required]
    [Column("eID", TypeName = "int")]
    public int EId { get; set; }

    [Required]
    [Column("setNumber", TypeName = "int")]
    public int SetNumber { get; set; }

    [Required]
    [Column("reps", TypeName = "int")]
    public int Reps { get; set; }

    [Column("Weight", TypeName = "int")]
    public int Weight { get; set; }

    [Column("PercentageOfOneRepMax", TypeName = "float")]
    public float PercentageOfOneRepMax { get; set; }
}