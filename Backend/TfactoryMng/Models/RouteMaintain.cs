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

    [Required, StringLength(50)]
    public string distance { get; set; } = string.Empty;

    public int? collectorId { get; set; }
    public int? vehicleId { get; set; }

    public ICollection<GrowerLocation> GrowerLocations { get; set; } = new List<GrowerLocation>();
}
