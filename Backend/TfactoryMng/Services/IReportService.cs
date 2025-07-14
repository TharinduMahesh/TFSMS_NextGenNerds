using TfactoryMng.DTOs;

namespace TfactoryMng.Services
{
    public interface IReportService
    {
        Task<IEnumerable<CollectorCostReportDto>> GetCostReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<CollectorPerformanceReportDto>> GetCollectorPerformanceReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<RoutePerformanceReportDto>> GetRoutePerformanceReportAsync(DateTime startDate, DateTime endDate);
    }
}