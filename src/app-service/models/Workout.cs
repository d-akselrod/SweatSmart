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
    public string name { get; set; }

    [Column("Date", TypeName = "Date")]
    [MaxLength(32)]
    public DateTime? date { get; set; }

    [Column("Duration", TypeName = "int")]
    public int? duration { get; set; }

}