using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Workouts")]
public class Workout
{
    [Key]
    [Column("wID", TypeName = "UniqueIdentifier")]
    public Guid WId { get; set; }

    [Required]
    [Column("Name", TypeName = "VarChar(32)")]
    [MaxLength(32)]
    public string Name { get; set; }

    [Column("Date", TypeName = "DateTime")]
    public DateTime? Date { get; set; }

    [Column("Duration", TypeName = "Int")]
    public int? Duration { get; set; }

    [Column("NumOfExercises", TypeName = "Int")]
    public int? NumOfExercises { get; set; }
}

