using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models
{
    [Table("Exercises")]
    public class Exercise
    {
        [Key]
        [Required]
        [Column("eID", TypeName = "int")]
        public int EId { get; set; }

        [Required]
        [Column("MuscleGroup", TypeName = "varchar(32)")]
        public required string MuscleGroup { get; set; }

        [Required]
        [Column("Name", TypeName = "varchar(32)")]
        public required string Name { get; set; }

        [Required]
        [Column("Level", TypeName = "char(1)")]
        public required string Level { get; set; }

        [Required]
        [Column("U_L_C", TypeName = "char(1)")]
        public required char? U_L_C { get; set; }

        [Column("P_P", TypeName = "varchar(4)")]
        public required string P_P { get; set; }

        [Required]
        [Column("Equipment", TypeName = "char(1)")]
        public required string Equipment { get; set; }

    }
}
