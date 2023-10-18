using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("PhysicalAttributes")]
public class PhysicalAttributes
{
    [Key]
    [Column("uID")]
    public Guid uID { get; set; }

    [Column("age")]
    public int? age { get; set; }

    [MaxLength(32)]
    [Column("gender")]
    public string gender { get; set; }

    [Column("height", TypeName = "decimal(5,2)")]
    public decimal? height { get; set; }

    [Column("weight", TypeName = "decimal(5,2)")]
    public decimal? weight { get; set; }
}