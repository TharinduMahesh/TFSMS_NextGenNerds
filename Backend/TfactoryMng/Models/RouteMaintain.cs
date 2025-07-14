using System.ComponentModel.DataAnnotations;
using TfactoryMng.Model;

public class RtList
{
    [Key]
    public int rId { get; set; }

    [Required, StringLength(100)]
    public string rName { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string startLocation { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string endLocation { get; set; } = string.Empty;

    public int? distance { get; set; }

    // --- FIX: Use PascalCase for all properties ---
    public int? CollectorId { get; set; }
    public Collector? Collector { get; set; }

    public ICollection<GrowerLocation> GrowerLocations { get; set; } = new List<GrowerLocation>();
    public ICollection<TripRecord> TripRecords { get; set; } = new List<TripRecord>();
}