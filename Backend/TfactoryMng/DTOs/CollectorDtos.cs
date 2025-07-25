using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    public class CreateUpdateCollectorDto
    {
        [Required, StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public decimal RatePerKm { get; set; }

        // --- ADD ALL NEW PROPERTIES HERE ---
        [Required(ErrorMessage = "NIC is required.")]
        [StringLength(100)]
        public string CollectorNIC { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string CollectorAddressLine1 { get; set; } = string.Empty;

        public string? CollectorAddressLine2 { get; set; }

        [Required]
        [StringLength(100)]
        public string CollectorCity { get; set; } = string.Empty;

        public string? CollectorPostalCode { get; set; }
        public string? CollectorGender { get; set; }
        public DateTime? CollectorDOB { get; set; }

        [Required]
        public string CollectorPhoneNum { get; set; } = string.Empty;

        [Required, EmailAddress]
        [StringLength(100)]
        public string CollectorEmail { get; set; } = string.Empty;
    }

    public class CollectorResponseDto
    {
        public int CollectorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal RatePerKm { get; set; }

        // --- ADD ALL NEW PROPERTIES HERE ---
        public string CollectorNIC { get; set; } = string.Empty;
        public string CollectorAddressLine1 { get; set; } = string.Empty;
        public string? CollectorAddressLine2 { get; set; }
        public string CollectorCity { get; set; } = string.Empty;
        public string? CollectorPostalCode { get; set; }
        public string? CollectorGender { get; set; }
        public DateTime? CollectorDOB { get; set; }
        public string? CollectorPhoneNum { get; set; }
        public string CollectorEmail { get; set; } = string.Empty;

        // Vehicle details are still needed
        public int? VehicleId { get; set; }
        public string? VehicleLicensePlate { get; set; }
        public double? VehicleVolume { get; set; } // Added volume from previous discussion
    }
}