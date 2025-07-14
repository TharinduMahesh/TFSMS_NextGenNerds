using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    // DTO for creating a new vehicle or updating an existing one
    public class CreateUpdateVehicleDto
    {
        [Required]
        public int CollectorId { get; set; } // The ID of the owner

        [Required, StringLength(50)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public double Volume { get; set; }

        [StringLength(100)]
        public string? Model { get; set; }

        [StringLength(500)]
        public string? ConditionNotes { get; set; }
    }

    // DTO for returning vehicle information from the API
    public class VehicleResponseDto
    {
        public int VehicleId { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public string? Model { get; set; }
        public string? ConditionNotes { get; set; }
    }
}