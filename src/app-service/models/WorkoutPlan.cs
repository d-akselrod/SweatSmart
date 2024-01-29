using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;
[Table("WorkoutPlan")]
public class WorkoutPlan
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
    [Column("sets", TypeName = "int")]
    public int Sets { get; set; }

    [Required]
    [Column("reps", TypeName = "int")]
    public int Reps { get; set; }
    
    [Column("PercentageOfOneRepMax", TypeName = "float")]
    public float PercentageOfOneRepMax { get; set; }
}