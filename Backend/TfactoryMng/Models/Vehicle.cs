using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.Model
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        [Required, StringLength(50)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public double Volume { get; set; }

        [StringLength(100)]
        public string? Model { get; set; }

        [StringLength(500)]
        public string? ConditionNotes { get; set; }

        // The relationship to its owner
        public int CollectorId { get; set; }
        public Collector Collector { get; set; }
    }
}