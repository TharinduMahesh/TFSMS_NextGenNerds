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

        [StringLength(20)]
        public string? ContactNumber { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RatePerKm { get; set; } = 0;

        // --- RELATIONSHIP UPDATES ---
        // A Collector is assigned to many Routes
        public ICollection<RtList> Routes { get; set; } = new List<RtList>();
        // A Collector can have many Trip Records
        public ICollection<TripRecord> TripRecords { get; set; } = new List<TripRecord>();
        // A Collector owns ONE Vehicle
        public Vehicle? Vehicle { get; set; }
    }
}