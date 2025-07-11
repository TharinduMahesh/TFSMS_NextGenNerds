using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TfactoryMng.Model
{
    public class GrowerLocation
    {
        [Key]
        public int gId { get; set; }

        [Required]
        public double latitude { get; set; } // Kept as double, which is standard for coordinates

        [Required]
        public double longitude { get; set; } // Kept as double

        [StringLength(100)]
        public string? description { get; set; }

        public int RtListId { get; set; }

        [JsonIgnore]
        public RtList? RtList { get; set; }
    }
}