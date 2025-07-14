using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    public class GrowerLocationDto
    {
        [Required]
        public double latitude { get; set; }

        [Required]
        public double longitude { get; set; }

        [StringLength(100)]
        public string? description { get; set; }
    }

    public class CreateUpdateRouteDto
    {
        [Required, StringLength(100)]
        public string rName { get; set; } = string.Empty;
        [Required, StringLength(100)]
        public string startLocation { get; set; } = string.Empty;
        [Required, StringLength(100)]
        public string endLocation { get; set; } = string.Empty;
        [Required]
        public int distance { get; set; }

        // ONLY need the CollectorId
        public int? CollectorId { get; set; }

        public ICollection<GrowerLocationDto> GrowerLocations { get; set; } = new List<GrowerLocationDto>();
    }
}