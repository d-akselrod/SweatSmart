using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using App_Service.Typings;

namespace App_Service.Models;

[Table("UserWorkout")]
public class UserWorkout
{
    [Required]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Required]
    [Column("wID", TypeName = "UniqueIdentifier")]
    public Guid WId { get; set; }

    [Required]
    [Column("status", TypeName = "int")]
    public WorkoutStatus Status { get; set; }
}