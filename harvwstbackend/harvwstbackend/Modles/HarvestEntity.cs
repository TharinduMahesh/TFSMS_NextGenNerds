namespace harvestbackend.Modles
{
    public class HarvestEntity
    {
        public int Id { get; set; }
        public DateTime HarvestDate { get; set; }
        public string SuperLeafWeight { get; set; }
        public string NormalLeafWeight { get; set; }
        public string TransportMethod { get; set; }
        public string PaymentMethod { get; set; }
    }

}
