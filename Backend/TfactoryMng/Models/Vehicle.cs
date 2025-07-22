using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        [Required]
        [StringLength(50)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public decimal Volume { get; set; }

        [StringLength(100)]
        public string? Model { get; set; }

        [StringLength(500)]
        public string? ConditionNotes { get; set; }

        [Required]
        public int CollectorId { get; set; }

        [ForeignKey("CollectorId")]
        public Collector Collector { get; set; } = null!;
    }
}