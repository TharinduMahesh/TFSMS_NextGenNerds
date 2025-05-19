using System.ComponentModel.DataAnnotations;

namespace TFSMS_app_backend.Models
{
    public class Harvest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime Time { get; set; }

        [Required]
        public double SupperLeafWeight { get; set; }

        [Required]
        public double NormalLeafWeight { get; set; }

        [Required]
        public string TransportMethod { get; set; } = string.Empty;

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";
    }
}
