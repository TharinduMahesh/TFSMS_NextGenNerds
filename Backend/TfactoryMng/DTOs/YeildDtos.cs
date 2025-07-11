// DTOs/YieldDtos.cs
using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    public class CreateUpdateYieldDto
    {
        [Required]
        public int rId { get; set; }

        [Required]
        [StringLength(100)]
        public string collected_Yield { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string golden_Tips_Present { get; set; } = string.Empty;
    }

    public class YieldResponseDto
    {
        public int yId { get; set; }
        public int rId { get; set; }
        public string? rName { get; set; }
        public string collected_Yield { get; set; } = string.Empty;
        public string golden_Tips_Present { get; set; } = string.Empty;
        public int? collectorID { get; set; }
        public int? vehicleID { get; set; }
    }
}