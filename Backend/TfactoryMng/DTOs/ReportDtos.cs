namespace TfactoryMng.DTOs
{
    // This DTO will hold the calculated cost for a single collector
    public class CollectorCostReportDto
    {
        public int CollectorId { get; set; }
        public string CollectorName { get; set; } = string.Empty;
        public int TotalTrips { get; set; }
        public decimal TotalDistance { get; set; }
        public decimal TotalCost { get; set; }
    }

    // This DTO will hold the calculated performance metrics for a single collector
    public class CollectorPerformanceReportDto
    {
        public int CollectorId { get; set; }
        public string CollectorName { get; set; } = string.Empty;
        public int TotalTripsCompleted { get; set; }
        public int OnTimeTrips { get; set; }
        public double OnTimePercentage { get; set; }
    }

    public class RoutePerformanceReportDto
    {
        public int RouteId { get; set; }
        public string RouteName { get; set; } = string.Empty;
        public int TotalTrips { get; set; }
        public double AverageTripDurationHours { get; set; }
        public double OnTimeDeparturePercentage { get; set; }
        public decimal TotalCost { get; set; }
        public decimal CostPerKm { get; set; }
    }
}