using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class RtList
    {
        [Key]
        public int id { get; set; }

        [Required]
        [StringLength(100)]
        public string rName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string startLocation { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string endLocation { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string distance { get; set; } = string.Empty;

        public int? collectorId { get; set; }
        public int? vehicleId { get; set; }

        public ICollection<YieldList> YieldLists { get; set; } = new List<YieldList>();
        public ICollection<TransportCost> TransportCosts { get; set; } = new List<TransportCost>();
        public ICollection<TransportPerformance> TransportPerformances { get; set; } = new List<TransportPerformance>();
    }
}