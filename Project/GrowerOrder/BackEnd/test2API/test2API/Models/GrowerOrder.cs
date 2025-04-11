namespace test2API.Models
{
    public class GrowerOrder
    {
        public int GrowerOrderId { get; set; }
        public decimal SuperTeaQuantity { get; set; }
        public decimal GreenTeaQuantity { get; set; }
        public DateTime PlaceDate { get; set; }
        public string TransportMethod { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;

    }
}
