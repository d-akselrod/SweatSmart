using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Users")]
public class User
{
    [Key]
    [Required]
    [Column("uID", TypeName = "UniqueIdentifier")]
    public Guid UId { get; set; }

    [Column("Name", TypeName = "VarChar(64)")]
    public string? Name { get; set; }

    [Required]
    [Column("username", TypeName = "VarChar(32)")]
    public string Username { get; set; }

    [Required]
    [Column("password", TypeName = "VarChar(32)")]
    public string Password { get; set; }

    [Required]
    [Column("email", TypeName = "VarChar(64)")]
    public string Email { get; set; }
}