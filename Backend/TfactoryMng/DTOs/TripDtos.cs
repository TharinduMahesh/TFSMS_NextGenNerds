using System.ComponentModel.DataAnnotations;

namespace TfactoryMng.DTOs
{
    // For scheduling a new trip
    public class ScheduleTripDto
    {
        [Required]
        public int RouteId { get; set; }

        [Required]
        public int CollectorId { get; set; }

        [Required]
        public DateTime ScheduledDeparture { get; set; }
    }

    // For updating a trip's status (e.g., when it departs or arrives)
    public class UpdateTripStatusDto
    {
        public DateTime? ActualDeparture { get; set; }
        public DateTime? ActualArrival { get; set; }
    }

    // For viewing a trip's details in a list or by itself
    public class TripResponseDto
    {
        public int TripId { get; set; }
        public int RouteId { get; set; }
        public string? RouteName { get; set; }
        public int CollectorId { get; set; }
        public string? CollectorName { get; set; }
        public DateTime ScheduledDeparture { get; set; }
        public DateTime? ActualDeparture { get; set; }
        public DateTime? ActualArrival { get; set; }
        public bool IsOnTime { get; set; }
    }
}