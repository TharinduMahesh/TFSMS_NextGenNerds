using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class YieldService : IYieldService
    {
        private readonly AppDbContext _context;

        public YieldService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<YieldResponseDto>> GetAllYieldsAsync()
        {
            // The query now needs to go deeper to get the Vehicle
            return await _context.YieldLists
                .Include(y => y.RtList) // Eager load the related Route
                    .ThenInclude(r => r.Collector) // From the Route, load its Collector
                        .ThenInclude(c => c.Vehicle) // From the Collector, load their Vehicle
                .Select(y => new YieldResponseDto
                {
                    yId = y.yId,
                    rId = y.rId,
                    rName = y.RtList.rName,
                    collected_Yield = y.collected_Yield,
                    golden_Tips_Present = y.golden_Tips_Present,
                    // We get CollectorId from the route
                    collectorID = y.RtList.CollectorId,
                    // We get VehicleId from the route's collector's vehicle
                    vehicleID = y.RtList.Collector.Vehicle.VehicleId
                })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<YieldResponseDto?> GetYieldByIdAsync(int id)
        {
            return await _context.YieldLists
               .Where(y => y.yId == id)
               .Include(y => y.RtList)
                    .ThenInclude(r => r.Collector)
                        .ThenInclude(c => c.Vehicle)
               .Select(y => new YieldResponseDto
               {
                   yId = y.yId,
                   rId = y.rId,
                   rName = y.RtList.rName,
                   collected_Yield = y.collected_Yield,
                   golden_Tips_Present = y.golden_Tips_Present,
                   collectorID = y.RtList.CollectorId,
                   vehicleID = y.RtList.Collector.Vehicle.VehicleId
               })
               .AsNoTracking()
               .FirstOrDefaultAsync();
        }

        public async Task<YieldResponseDto> CreateYieldAsync(CreateUpdateYieldDto yieldDto)
        {
            // 1. Find the related route and eagerly load its collector and their vehicle.
            var relatedRoute = await _context.RtLists
                .Include(r => r.Collector)
                    .ThenInclude(c => c.Vehicle)
                .FirstOrDefaultAsync(r => r.rId == yieldDto.rId);

            if (relatedRoute == null)
            {
                throw new KeyNotFoundException($"Route with ID {yieldDto.rId} does not exist.");
            }

            // 2. Create the new YieldList entity.
            var newYield = new YieldList
            {
                rId = yieldDto.rId,
                collected_Yield = yieldDto.collected_Yield,
                golden_Tips_Present = yieldDto.golden_Tips_Present
            };

            _context.YieldLists.Add(newYield);
            await _context.SaveChangesAsync();

            // 3. Manually build the response DTO using the data we have.
            return new YieldResponseDto
            {
                yId = newYield.yId,
                rId = newYield.rId,
                rName = relatedRoute.rName,
                collected_Yield = newYield.collected_Yield,
                golden_Tips_Present = newYield.golden_Tips_Present,
                collectorID = relatedRoute.CollectorId,
                // Get the VehicleId from the pre-loaded data
                vehicleID = relatedRoute.Collector?.Vehicle?.VehicleId
            };
        }

        public async Task<YieldResponseDto?> UpdateYieldAsync(int id, CreateUpdateYieldDto yieldDto)
        {
            var existingYield = await _context.YieldLists.FindAsync(id);
            if (existingYield == null) return null;

            // Find the new related route and its relations
            var relatedRoute = await _context.RtLists
                .Include(r => r.Collector)
                    .ThenInclude(c => c.Vehicle)
                .FirstOrDefaultAsync(r => r.rId == yieldDto.rId);

            if (relatedRoute == null)
            {
                throw new KeyNotFoundException($"Route with ID {yieldDto.rId} does not exist.");
            }

            existingYield.rId = yieldDto.rId;
            existingYield.collected_Yield = yieldDto.collected_Yield;
            existingYield.golden_Tips_Present = yieldDto.golden_Tips_Present;

            await _context.SaveChangesAsync();

            return new YieldResponseDto
            {
                yId = existingYield.yId,
                rId = existingYield.rId,
                rName = relatedRoute.rName,
                collected_Yield = existingYield.collected_Yield,
                golden_Tips_Present = existingYield.golden_Tips_Present,
                collectorID = relatedRoute.CollectorId,
                vehicleID = relatedRoute.Collector?.Vehicle?.VehicleId
            };
        }

        public async Task<bool> DeleteYieldAsync(int id)
        {
            var yieldToDelete = await _context.YieldLists.FindAsync(id);
            if (yieldToDelete == null) return false;

            _context.YieldLists.Remove(yieldToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}