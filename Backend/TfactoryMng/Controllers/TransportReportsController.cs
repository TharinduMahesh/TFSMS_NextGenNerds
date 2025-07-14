using Microsoft.AspNetCore.Mvc;
using TfactoryMng.Services;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransportReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public TransportReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Gets a transport cost report grouped by collector.
        /// </summary>
        [HttpGet("costs-by-collector")]
        public async Task<IActionResult> GetCostsByCollector([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GetCostReportAsync(startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Gets a performance report (on-time percentage) grouped by collector.
        /// </summary>
        [HttpGet("performance-by-collector")]
        public async Task<IActionResult> GetCollectorPerformance([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GetCollectorPerformanceReportAsync(startDate, endDate);
            return Ok(report);
        }

        /// <summary>
        /// Gets a performance and cost-efficiency report grouped by route.
        /// </summary>
        [HttpGet("performance-by-route")]
        public async Task<IActionResult> GetRoutePerformance([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GetRoutePerformanceReportAsync(startDate, endDate);
            return Ok(report);
        }
    }
}