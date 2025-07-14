using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.Model
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        [Required, StringLength(50)]
        public string LicensePlate { get; set; } = string.Empty;

        // ** NEW **: Vehicle Volume/Capacity
        [Required]
        public double Volume { get; set; } // e.g., in cubic meters or another unit

        [StringLength(100)]
        public string? Model { get; set; }

        [StringLength(500)]
        public string? ConditionNotes { get; set; }

        // ** NEW **: This creates the one-to-one relationship
        // Each vehicle is owned by one collector.
        public int CollectorId { get; set; }
        public Collector? Collector { get; set; }
    }
}