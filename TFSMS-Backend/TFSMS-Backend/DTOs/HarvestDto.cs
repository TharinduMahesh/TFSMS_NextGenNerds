namespace TFSMS_Backend.DTOs
{
    public class HarvestDto
    {
        public DateTime HarvestDate { get; set; }
        public double SuperLeafWeight { get; set; }
        public double NormalLeafWeight { get; set; }
        public string TransportMethod { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
