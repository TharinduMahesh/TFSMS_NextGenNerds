using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.Model
{
    public class TripRecord
    {
        [Key]
        public int TripId { get; set; }

        // Foreign key to the route this trip was for
        [Required]
        public int RouteId { get; set; }
        public RtList? Route { get; set; }

        // Foreign key to the collector who made the trip
        [Required]
        public int CollectorId { get; set; }
        public Collector? Collector { get; set; }

        [Required]
        public DateTime ScheduledDeparture { get; set; }
        public DateTime? ActualDeparture { get; set; }
        public DateTime? ActualArrival { get; set; }

        public bool IsOnTime => ActualDeparture.HasValue && ActualDeparture.Value <= ScheduledDeparture;
    }
}