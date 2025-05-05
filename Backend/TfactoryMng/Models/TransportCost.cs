using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class TransportCost
    {
        [Key]
        public int id { get; set; }

        [Required]
        public string rName { get; set; } = string.Empty;

        [Required]
        public string transporterName { get; set; } = string.Empty;

        [Required]
        public decimal costPerKM { get; set; }

        [Required]
        public decimal totalDistanceKM { get; set; }

        [Required]
        public decimal totalCost { get; set; }

        [Required]
        public DateTime date { get; set; }

        [ForeignKey("rName")]
        public RtList? RtList { get; set; }
    }
}