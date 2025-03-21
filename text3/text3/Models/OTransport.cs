namespace text3.Models
{
    public class OTransport
    {
        public int OTransportId { get; set; }
        public string? TransportType { get; set; }
    }
    public enum TransportType
    {
        Air,
        Sea,
        Land
    }
}

