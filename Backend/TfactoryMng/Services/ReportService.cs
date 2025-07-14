using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CollectorCostReportDto>> GetCostReportAsync(DateTime startDate, DateTime endDate)
        {
            var completedTrips = await _context.TripRecords
                .Where(t => t.ActualArrival.HasValue &&
                             t.ActualArrival.Value.Date >= startDate.Date &&
                             t.ActualArrival.Value.Date <= endDate.Date)
                .Include(t => t.Route)
                .Include(t => t.Collector)
                .AsNoTracking()
                .ToListAsync();

            var report = completedTrips
                // Add a WHERE clause here in memory to filter out any bad data
                .Where(t => t.Collector != null && t.Route != null)
                .GroupBy(t => t.Collector)
                // Also filter out any groups that might have a null key, just in case
                .Where(g => g.Key != null)
                .Select(g => new CollectorCostReportDto
                {
                    CollectorId = g.Key.CollectorId,
                    CollectorName = g.Key.Name,
                    TotalTrips = g.Count(),
                    // Use `?? 0` to provide a default value for null distances before summing.
                    // The result of Sum() on an int is an int, which implicitly converts to decimal.
                    TotalDistance = g.Sum(t => t.Route.distance ?? 0),
                    // Use `?? 0` inside the sum to prevent multiplication errors.
                    TotalCost = g.Sum(t => (decimal)(t.Route.distance ?? 0) * g.Key.RatePerKm)
                })
                .ToList();

            return report;
        }

        public async Task<IEnumerable<CollectorPerformanceReportDto>> GetCollectorPerformanceReportAsync(DateTime startDate, DateTime endDate)
        {
            var departedTrips = await _context.TripRecords
                .Where(t => t.ActualDeparture.HasValue &&
                             t.ActualDeparture.Value.Date >= startDate.Date &&
                             t.ActualDeparture.Value.Date <= endDate.Date)
                .Include(t => t.Collector)
                .AsNoTracking()
                .ToListAsync();

            var report = departedTrips
                .Where(t => t.Collector != null)
                .GroupBy(t => t.Collector)
                .Where(g => g.Key != null)
                .Select(g => new CollectorPerformanceReportDto
                {
                    CollectorId = g.Key.CollectorId,
                    CollectorName = g.Key.Name,
                    TotalTripsCompleted = g.Count(),
                    OnTimeTrips = g.Count(t => t.IsOnTime),
                    OnTimePercentage = g.Any() ? Math.Round((double)g.Count(t => t.IsOnTime) / g.Count() * 100.0, 2) : 0
                })
                .ToList();

            return report;
        }

        public async Task<IEnumerable<RoutePerformanceReportDto>> GetRoutePerformanceReportAsync(DateTime startDate, DateTime endDate)
        {
            var completedTrips = await _context.TripRecords
                .Where(t => t.ActualArrival.HasValue && t.ActualDeparture.HasValue &&
                             t.ActualArrival.Value.Date >= startDate.Date &&
                             t.ActualArrival.Value.Date <= endDate.Date)
                .Include(t => t.Route)
                    .ThenInclude(r => r.Collector) // Use ThenInclude for chained loading
                .AsNoTracking()
                .ToListAsync();

            var report = completedTrips
                .Where(t => t.Route != null && t.Route.Collector != null)
                .GroupBy(t => t.Route)
                .Where(g => g.Key != null)
                .Select(g => {
                    // Pre-calculate the total cost to use it in two places
                    var totalCostForRoute = g.Sum(t => (decimal)(t.Route.distance ?? 0) * t.Route.Collector.RatePerKm);
                    // Use GetValueOrDefault() to safely handle the nullable distance for division
                    var totalDistanceForRoute = g.Key.distance.GetValueOrDefault();

                    return new RoutePerformanceReportDto
                    {
                        RouteId = g.Key.rId,
                        RouteName = g.Key.rName,
                        TotalTrips = g.Count(),
                        // Safe access for Average because the top-level Where clause guarantees these values exist.
                        AverageTripDurationHours = Math.Round(g.Average(t => (t.ActualArrival.Value - t.ActualDeparture.Value).TotalHours), 2),
                        OnTimeDeparturePercentage = g.Any() ? Math.Round((double)g.Count(t => t.IsOnTime) / g.Count() * 100.0, 2) : 0,
                        TotalCost = totalCostForRoute,
                        CostPerKm = totalDistanceForRoute > 0 ? totalCostForRoute / totalDistanceForRoute : 0
                    };
                })
                .ToList();

            return report;
        }
    }
}