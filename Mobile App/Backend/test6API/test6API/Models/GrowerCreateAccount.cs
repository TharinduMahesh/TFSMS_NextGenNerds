using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace test6API.Models
{
    public class GrowerCreateAccount
    {
        [Key]
        public int GrowerAccountId { get; set; }

        [Required]
        public string GrowerFirstName { get; set; }

        [Required]
        public string GrowerLastName { get; set; }

        [Required]
        public string GrowerNIC { get; set; }

        [Required]
        public string GrowerAddressLine1 { get; set; }

        public string GrowerAddressLine2 { get; set; }

        [Required]
        public string GrowerCity { get; set; }

        public string GrowerPostalCode { get; set; }

        public string GrowerGender { get; set; }

        public DateTime? GrowerDOB { get; set; }

        [Required]
        public string GrowerPhoneNum { get; set; }

        [Required]
        public string MoneyMethod { get; set; }

        [Required]
        public string GrowerEmail { get; set; }

    }
}

