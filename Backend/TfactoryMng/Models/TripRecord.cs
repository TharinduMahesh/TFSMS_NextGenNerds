using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.Model
{
    public class TripRecord
    {
        [Key]
        public int TripId { get; set; }

        [Required]
        public int RouteId { get; set; }
        public RtList? Route { get; set; }

        [Required]
        public int CollectorId { get; set; }
        public Collector? Collector { get; set; }

        [Required]
        public DateTime ScheduledDeparture { get; set; }

        // --- ADD THIS NEW PROPERTY ---
        [Required]
        public DateTime ScheduledArrival { get; set; }

        // Actual times are still nullable as they are filled in later
        public DateTime? ActualDeparture { get; set; }
        public DateTime? ActualArrival { get; set; }

        // The 'OnTime' logic is still based on departure
        public bool IsOnTime => ActualDeparture.HasValue && ActualDeparture.Value <= ScheduledDeparture;
    }
}