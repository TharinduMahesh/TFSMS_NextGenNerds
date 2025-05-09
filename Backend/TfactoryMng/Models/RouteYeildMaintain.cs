//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace TfactoryMng.Model
//{
//    public class YieldList
//    {
//        [Key]
//        public int yId { get; set; }

//        [Required]
//        [StringLength(100)]
//        public string rName { get; set; } = string.Empty;

//        [Required]
//        [StringLength(100)]
//        public string collected_Yield { get; set; } = string.Empty;

//        [Required]
//        [StringLength(100)]
//        public string golden_Tips_Present { get; set; } = string.Empty;

//        public int collectorID { get; set; }
//        public int vehicalID { get; set; }

//        // Foreign key to RtList
//        [ForeignKey("rName")]
//        public RtList? RtList { get; set; }
//    }
//}