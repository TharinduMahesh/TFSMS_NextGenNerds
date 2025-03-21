namespace text3.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public string? PaymentMethod { get; set; }
    }
    public enum PaymentMethod
    {
        Cash,
        Bank
    }
}
