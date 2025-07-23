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
            // 1. Fetch raw data from the database
            var completedTrips = await _context.TripRecords
                .Where(t => t.ActualArrival.HasValue &&
                             t.ActualArrival.Value.Date >= startDate.Date &&
                             t.ActualArrival.Value.Date <= endDate.Date)
                .Include(t => t.Route)
                .Include(t => t.Collector)
                .AsNoTracking()
                .ToListAsync();

            // 2. Perform grouping and calculations in C# memory
            var report = completedTrips
                .Where(t => t.Collector != null && t.Route != null)
                // Corrected: Group by properties (values) to prevent duplicates
                .GroupBy(t => new {
                    t.Collector.CollectorId,
                    t.Collector.Name,
                    t.Collector.RatePerKm
                })
                .Select(g => new CollectorCostReportDto
                {
                    CollectorId = g.Key.CollectorId,
                    CollectorName = g.Key.Name,
                    TotalTrips = g.Count(),
                    TotalDistance = g.Sum(t => t.Route.distance ?? 0),
                    TotalCost = g.Sum(t => (decimal)(t.Route.distance ?? 0) * g.Key.RatePerKm)
                })
                .ToList();

            return report;
        }

        public async Task<IEnumerable<CollectorPerformanceReportDto>> GetCollectorPerformanceReportAsync(DateTime startDate, DateTime endDate)
        {
            // 1. Fetch raw data
            var departedTrips = await _context.TripRecords
                .Where(t => t.ActualDeparture.HasValue &&
                             t.ActualDeparture.Value.Date >= startDate.Date &&
                             t.ActualDeparture.Value.Date <= endDate.Date)
                .Include(t => t.Collector)
                .AsNoTracking()
                .ToListAsync();

            // 2. Perform grouping and calculations in C# memory
            var report = departedTrips
                .Where(t => t.Collector != null)
                // Corrected: Group by properties (values) to prevent duplicates
                .GroupBy(t => new {
                    t.Collector.CollectorId,
                    t.Collector.Name
                })
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
            // 1. Fetch all necessary raw data from the database
            var completedTrips = await _context.TripRecords
                .Where(t => t.ActualArrival.HasValue && t.ActualDeparture.HasValue &&
                             t.ActualArrival.Value.Date >= startDate.Date &&
                             t.ActualArrival.Value.Date <= endDate.Date)
                .Include(t => t.Route)
                    .ThenInclude(r => r.Collector)
                .AsNoTracking()
                .ToListAsync();

            // 2. Perform grouping and calculations in C# memory
            var report = completedTrips
                .Where(t => t.Route != null && t.Route.Collector != null)
                // Corrected: Group by route properties (values) to prevent duplicates
                .GroupBy(t => new {
                    t.Route.rId,
                    t.Route.rName,
                    t.Route.distance
                })
                .Select(g => {
                    var totalCostForRoute = g.Sum(t => (decimal)(t.Route.distance ?? 0) * t.Route.Collector.RatePerKm);
                    var totalDistanceForRoute = g.Key.distance.GetValueOrDefault();

                    return new RoutePerformanceReportDto
                    {
                        RouteId = g.Key.rId,
                        RouteName = g.Key.rName,
                        TotalTrips = g.Count(),
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