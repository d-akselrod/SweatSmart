using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("PhysicalAttributes")]
public class PhysicalAttributes
{
    [Key]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [MaxLength(32)]
    [Column("gender", TypeName = "VarChar(32)")]
    public string? Gender { get; set; }

    [Column("age", TypeName = "Int")]
    public int? Age { get; set; }

    [Column("height", TypeName = "Decimal(5,2)")]
    public decimal? Height { get; set; }

    [Column("weight", TypeName = "Decimal(5,2)")]
    public decimal? Weight { get; set; }
}