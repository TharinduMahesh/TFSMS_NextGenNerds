using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class Collector
    {
        [Key]
        public int CollectorId { get; set; }

        [Required, StringLength(150)]
        public string Name { get; set; } = string.Empty;

        // --- ADD ALL NEW PROPERTIES HERE ---
        [Required(ErrorMessage = "NIC is required.")]
        [StringLength(100)]
        public string CollectorNIC { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string CollectorAddressLine1 { get; set; } = string.Empty;

        [StringLength(255)]
        public string? CollectorAddressLine2 { get; set; }

        [Required]
        [StringLength(100)]
        public string CollectorCity { get; set; } = string.Empty;

        [StringLength(20)]
        public string? CollectorPostalCode { get; set; }

        [StringLength(10)]
        public string? CollectorGender { get; set; }

        public DateTime? CollectorDOB { get; set; }

        [StringLength(20)]
        public string? CollectorPhoneNum { get; set; }

        [Required, EmailAddress]
        [StringLength(100)]
        public string CollectorEmail { get; set; } = string.Empty;
        // --- END OF NEW PROPERTIES ---

        [Column(TypeName = "decimal(18,2)")]
        public decimal RatePerKm { get; set; } = 0;

        // Relationships are unchanged
        public ICollection<RtList> Routes { get; set; } = new List<RtList>();
        public ICollection<TripRecord> TripRecords { get; set; } = new List<TripRecord>();
        public Vehicle? Vehicle { get; set; }
    }
}