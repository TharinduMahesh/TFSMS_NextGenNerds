using System.ComponentModel.DataAnnotations;

namespace test6API.Models
{
    public class GrowerSignUp
    {
        [Key]
        public int GrowerId { get; set; }

        [Required]
        [EmailAddress]
        public string GrowerEmail { get; set; }

        [Required]
        public string GrowerPassword { get; set; }

    }
}
