using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

public class UserWorkout
{
    [Key]
    [Required]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Key]
    [Required]
    [Column("wID", TypeName = "UniqueIdentifier")]
    public Guid WId { get; set; }

    [Required]
    [Column("status", TypeName = "int")]
    public int Status { get; set; }

    [Required]
    [Column("date", TypeName = "DateTime")]
    public DateTime Date { get; set; }
}