using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Exercises")]
public class Exercise
{
    [Required]
    [Key]
    [Column("eID", TypeName = "Integer")]
    public int EId { get; set; }

    [Required]
    [Column("Name", TypeName = "VarChar(32)")]
    public string Name { get; set; }

    [Required]
    [Column("Description", TypeName = "Text")]
    public string Description { get; set; }

    [Required]
    [Column("MuscleGroup", TypeName = "VarChar(32)")]
    public string MuscleGroup { get; set; }

    [Column("Duration", TypeName = "Integer")]
    public int Duration { get; set; }
}