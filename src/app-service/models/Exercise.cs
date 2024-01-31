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
        public string MuscleGroup { get; set; }

        [Required]
        [Column("TargetMuscle", TypeName = "varchar(32")]
        public string TargetMuscle { get; set; }

        [Required]
        [Column("Name", TypeName = "varchar(32)")]
        public string Name { get; set; }

        [Required]
        [Column("Level", TypeName = "char(1)")]
        public char Level { get; set; }

        [Required]
        [Column("U_L_C", TypeName = "char(1)")]
        public char U_L_C { get; set; }

        [Required]
        [Column("P_P", TypeName = "varchar(4)")]
        public string P_P { get; set; }

        [Required]
        [Column("Equipment", TypeName = "char(1)")]
        public char Equipment { get; set; }

    }
}
