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

        // Corrected to match the RtList model
        public int? distance { get; set; }

        public int? collectorId { get; set; }
        public int? vehicleId { get; set; }

        // This should be an empty list by default, not null.
        public ICollection<GrowerLocationDto> GrowerLocations { get; set; } = new List<GrowerLocationDto>();
    }
}