using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("UserPreferences")]
public class UserPreferences
{
    [Key]
    [Required]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Required]
    [Column("Goal", TypeName = "VarChar(32)")]
    public string Goal { get; set; }

    [Required]
    [Column("ExperienceLevel", TypeName = "ExerienceLevel")]
    public ExperienceLevel ExperienceLevel { get; set; }

    [Required]
    [Column("Frequency", TypeName = "Int")]
    public int Frequency { get; set; }

    [Required]
    [Column("EquipmentAvailable", TypeName = "Char(1)")]
    public EquipmentAvailable EquipmentAvailable { get; set; }

    [Required]
    [Column("TimeAvailable", TypeName = "Int")]
    public int TimeAvailable { get; set; }

}