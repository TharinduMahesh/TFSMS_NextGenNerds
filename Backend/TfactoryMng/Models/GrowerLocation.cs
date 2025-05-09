using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TfactoryMng.Model
{
    public class GrowerLocation
    {
        [Key]
        public int gId { get; set; }

        [Required]
        public double latitude { get; set; }

        [Required]
        public double longitude { get; set; }

        [StringLength(100)]
        public string? description { get; set; }

        public int RtListId { get; set; }

        [JsonIgnore]
        public RtList? RtList { get; set; }
    }
}