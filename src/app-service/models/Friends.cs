using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Friends")]
public class Friendship
{
    [Key]
    [Required]
    [Column("friend1", TypeName = "VarChar(32)")]
    public string Friend1 { get; set; }

    [Key]
    [Required]
    [Column("friend2", TypeName = "VarChar(32)")]
    public string Friend2 { get; set; }
}