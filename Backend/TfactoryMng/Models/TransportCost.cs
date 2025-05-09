//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace TfactoryMng.Model
//{
//    public class TransportCost
//    {
//        [Key]
//        public int tId { get; set; }

//        [Required]
//        public string transporterName { get; set; } = string.Empty;

//        [Required]
//        public decimal costPerKM { get; set; }

//        [Required]
//        public decimal totalDistanceKM { get; set; }

//        [Required]
//        public decimal totalCost { get; set; }

//        [Required]
//        public DateTime date { get; set; }

//        public ICollection<TransportPerformance> TransportPerformances { get; set; } = new List<TransportPerformance>();
//    }
//}