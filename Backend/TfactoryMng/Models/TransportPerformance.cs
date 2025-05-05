using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class TransportPerformance
    {
        [Key]
        public int id { get; set; }

        [Required]
        public string rName { get; set; } = string.Empty;

        [Required]
        public string transporterName { get; set; } = string.Empty;

        [Required]
        public string vehicleNumber { get; set; } = string.Empty;

        [Required]
        public DateTime arrivalTime { get; set; }

        [Required]
        public DateTime scheduledTime { get; set; }

        public bool isOnTime { get; set; }
        public string? remarks { get; set; }

        [ForeignKey("rName")]
        public RtList? RtList { get; set; }
    }
}