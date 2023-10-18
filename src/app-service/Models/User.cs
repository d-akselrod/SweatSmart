using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models;

[Table("Users")]
public class User
{
    [Key]
    [Column("uID")]
    public Guid uID { get; set; }

    [Column("FirstName")]
    [MaxLength(32)]
    public string firstName { get; set; }

    [Column("LastName")]
    [MaxLength(32)]
    public string lastName { get; set; }

    [Column("username")]
    [MaxLength(32)]
    public string username { get; set; }

    [Column("password")]
    [MaxLength(32)]
    public string password { get; set; }

    [Column("email")]
    [MaxLength(64)]
    public string email { get; set; }
}