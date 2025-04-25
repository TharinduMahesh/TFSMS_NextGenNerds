
using System.ComponentModel.DataAnnotations;

namespace Rviewmodel.Model
{
    public class Rview
    {
        [Key]
        public int? Id { get; set; }

        [Required]
        [StringLength(100)]
        public string RName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string StartLocation { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string EndLocation { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Distance { get; set; } = string.Empty;

        public int? CollectorId { get; set; }
        public int? VehicleId { get; set; }
    }


    
}