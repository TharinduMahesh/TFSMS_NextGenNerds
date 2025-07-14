using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    // For creating or updating a collector
    public class CreateUpdateCollectorDto
    {
        [Required, StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [StringLength(20)]
        public string? ContactNumber { get; set; }

        [Required]
        public decimal RatePerKm { get; set; }
    }

    // For viewing a collector's details
    public class CollectorResponseDto
    {
        public int CollectorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
        public decimal RatePerKm { get; set; }

        public int? VehicleId { get; set; }
        public string? VehicleLicensePlate { get; set; }
        public double? VehicleVolume { get; set; }
    }
}