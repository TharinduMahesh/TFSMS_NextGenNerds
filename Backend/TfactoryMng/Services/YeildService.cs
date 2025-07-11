// Services/YieldService.cs
using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;
using System.Linq;

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
            return await _context.YieldLists
                .Include(y => y.RtList)
                .Select(y => MapToDto(y)) // Use a helper method for clean mapping
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<YieldResponseDto?> GetYieldByIdAsync(int id)
        {
            var yield = await _context.YieldLists
                .Include(y => y.RtList)
                .AsNoTracking()
                .FirstOrDefaultAsync(y => y.yId == id);

            return yield == null ? null : MapToDto(yield);
        }

        public async Task<YieldResponseDto> CreateYieldAsync(CreateUpdateYieldDto yieldDto)
        {
            var routeExists = await _context.RtLists.AnyAsync(r => r.rId == yieldDto.rId);
            if (!routeExists)
            {
                throw new KeyNotFoundException($"Route with ID {yieldDto.rId} does not exist.");
            }

            var newYield = new YieldList
            {
                rId = yieldDto.rId,
                collected_Yield = yieldDto.collected_Yield,
                golden_Tips_Present = yieldDto.golden_Tips_Present
            };

            _context.YieldLists.Add(newYield);
            await _context.SaveChangesAsync();

            // We need to fetch the created entity with its navigation property to map it
            var createdYieldWithRoute = await GetYieldByIdAsync(newYield.yId);
            return createdYieldWithRoute!; // We know it exists
        }

        public async Task<YieldResponseDto?> UpdateYieldAsync(int id, CreateUpdateYieldDto yieldDto)
        {
            var existingYield = await _context.YieldLists.FindAsync(id);
            if (existingYield == null)
            {
                return null;
            }

            var routeExists = await _context.RtLists.AnyAsync(r => r.rId == yieldDto.rId);
            if (!routeExists)
            {
                throw new KeyNotFoundException($"Route with ID {yieldDto.rId} does not exist.");
            }

            existingYield.rId = yieldDto.rId;
            existingYield.collected_Yield = yieldDto.collected_Yield;
            existingYield.golden_Tips_Present = yieldDto.golden_Tips_Present;

            await _context.SaveChangesAsync();

            var updatedYieldWithRoute = await GetYieldByIdAsync(id);
            return updatedYieldWithRoute;
        }

        public async Task<bool> DeleteYieldAsync(int id)
        {
            var yieldToDelete = await _context.YieldLists.FindAsync(id);
            if (yieldToDelete == null)
            {
                return false;
            }

            _context.YieldLists.Remove(yieldToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper method to keep mapping logic in one place
        private static YieldResponseDto MapToDto(YieldList yield)
        {
            return new YieldResponseDto
            {
                yId = yield.yId,
                rId = yield.rId,
                rName = yield.RtList?.rName, // Null conditional for safety
                collected_Yield = yield.collected_Yield,
                golden_Tips_Present = yield.golden_Tips_Present,
                collectorID = yield.RtList?.collectorId,
                vehicleID = yield.RtList?.vehicleId
            };
        }
    }
}