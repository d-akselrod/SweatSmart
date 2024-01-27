using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Workouts")]
public class Workout
{
    [Key]
    [Column("wID", TypeName = "UniqueIdentifier")]
    public Guid WId { get; set; }

    [Column("Date", TypeName = "Date")]
    [MaxLength(32)]
    public DateTime? date { get; set; }

    [Required]
    [Column("WorkoutType", TypeName = "WorkoutType")]
    [MaxLength(32)]
    public WorkoutType WorkoutType { get; set; }

    [Column("Duration", TypeName = "Time(0)")]
    public TimeSpan? duration { get; set; }

}