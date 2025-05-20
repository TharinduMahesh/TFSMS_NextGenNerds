using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TfactoryMng.Model
{
    public class YieldList
    {
        [Key]
        public int yId { get; set; }

        [Required]
        public int rId { get; set; }  // Foreign key to RtList (must match RtList.rId type)

        [Required]
        [StringLength(100)]
        public string collected_Yield { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string golden_Tips_Present { get; set; } = string.Empty;

        // Navigation property
        [ForeignKey("rId")]
        public RtList? RtList { get; set; }
    }
}