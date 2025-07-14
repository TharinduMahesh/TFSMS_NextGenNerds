using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class CollectorService : ICollectorService
    {
        private readonly AppDbContext _context;

        public CollectorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CollectorResponseDto> CreateAsync(CreateUpdateCollectorDto dto)
        {
            var collector = new Collector
            {
                Name = dto.Name,
                ContactNumber = dto.ContactNumber,
                RatePerKm = dto.RatePerKm
            };

            _context.Collectors.Add(collector);
            await _context.SaveChangesAsync();

            return MapToDto(collector);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var collector = await _context.Collectors.FindAsync(id);
            if (collector == null) return false;

            _context.Collectors.Remove(collector);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CollectorResponseDto>> GetAllAsync()
        {
            return await _context.Collectors
                .Include(c => c.Vehicle) 
                .Select(c => MapToDto(c))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<CollectorResponseDto?> GetByIdAsync(int id)
        {
            var collector = await _context.Collectors.FindAsync(id);
            return collector == null ? null : MapToDto(collector);
        }

        public async Task<CollectorResponseDto?> UpdateAsync(int id, CreateUpdateCollectorDto dto)
        {
            var collector = await _context.Collectors.FindAsync(id);
            if (collector == null) return null;

            collector.Name = dto.Name;
            collector.ContactNumber = dto.ContactNumber;
            collector.RatePerKm = dto.RatePerKm;

            await _context.SaveChangesAsync();
            return MapToDto(collector);
        }

        private static CollectorResponseDto MapToDto(Collector c) => new()
        {
            CollectorId = c.CollectorId,
            Name = c.Name,
            ContactNumber = c.ContactNumber,
            RatePerKm = c.RatePerKm,
            // Map vehicle details if they exist
            VehicleId = c.Vehicle?.VehicleId,
            VehicleLicensePlate = c.Vehicle?.LicensePlate,
            VehicleVolume = c.Vehicle?.Volume
        };
    }
}