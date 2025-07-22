using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    public class CreateUpdateVehicleDto
    {
        [Required]
        public int CollectorId { get; set; }

        [Required, StringLength(50)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public double Volume { get; set; }

        [StringLength(100)]
        public string? Model { get; set; }

        [StringLength(500)]
        public string? ConditionNotes { get; set; }
    }

    public class VehicleResponseDto
    {
        public int VehicleId { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public string? Model { get; set; }
        public string? ConditionNotes { get; set; }
        public double Volume { get; set; }
        public int CollectorId { get; set; }
        public string? CollectorName { get; set; }
    }
}