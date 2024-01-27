using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App_Service.Models
{
    [Table("WorkoutExercise")]
    public class WorkoutExercise
    {

        [Key]
        [Required]
        [Column("weID", TypeName = "UniqueIdentifier")]
        public Guid WEId { get; set; }

        [Required]
        [ForeignKey("Exercise")]
        public Guid EId { get; set; }

        [Required]
        [ForeignKey("Workout")]
        public Guid WId { get; set; }

        [Required]
        [Column("Sets", TypeName = "int")]
        public int Sets { get; set; }

        [Required]
        [Column("Reps", TypeName = "int")]
        public int Reps { get; set; }

        [Required]
        [Column("PercentageOfOneRepMax", TypeName = "double")]
        public double PercentageOfOneRepMax { get; set; }
    }
}