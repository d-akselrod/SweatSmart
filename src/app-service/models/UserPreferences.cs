using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using App_Service.Typings;

namespace App_Service.Models;

[Table("UserPreferences")]
public class UserPreferences
{
    [Key]
    [Required]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Required]
    [Column("Goal", TypeName = "Int")]
    public PersonalGoal Goal { get; set; }

    [Required]
    [Column("ExperienceLevel", TypeName = "Int")]
    public ExperienceLevel ExperienceLevel { get; set; }

    [Required]
    [Column("Frequency", TypeName = "Int")]
    public int Frequency { get; set; }

    [Required]
    [Column("Equipment", TypeName = "int")]
    public EquipmentAvailable Equipment { get; set; }

    [Required]
    [Column("TimeAvailable", TypeName = "Int")]
    public int TimeAvailable { get; set; }

}