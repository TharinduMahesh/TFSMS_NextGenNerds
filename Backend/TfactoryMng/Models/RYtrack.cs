using System.ComponentModel.DataAnnotations;

namespace RYtrack.Model
{
    public class YieldList
    {
        [Key]
        public int RouteId { get; set; }

        [Required]
        [StringLength(100)]
        public string RouteName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Collected_Yield { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Golden_Tips_Present { get; set; } = string.Empty;

        public int CollectorID { get; set; }

        public int VehicalID { get; set; }
    }

}
