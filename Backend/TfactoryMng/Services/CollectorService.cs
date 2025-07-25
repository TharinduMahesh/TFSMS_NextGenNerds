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
                RatePerKm = dto.RatePerKm,
                CollectorNIC = dto.CollectorNIC,
                CollectorAddressLine1 = dto.CollectorAddressLine1,
                CollectorAddressLine2 = dto.CollectorAddressLine2,
                CollectorCity = dto.CollectorCity,
                CollectorPostalCode = dto.CollectorPostalCode,
                CollectorGender = dto.CollectorGender,
                CollectorDOB = dto.CollectorDOB,
                CollectorPhoneNum = dto.CollectorPhoneNum,
                CollectorEmail = dto.CollectorEmail
            };

            _context.Collectors.Add(collector);
            await _context.SaveChangesAsync();
            return MapToDto(collector);
        }

        public async Task<CollectorResponseDto?> UpdateAsync(int id, CreateUpdateCollectorDto dto)
        {
            var collector = await _context.Collectors.FindAsync(id);
            if (collector == null) return null;

            collector.Name = dto.Name;
            collector.RatePerKm = dto.RatePerKm;
            collector.CollectorNIC = dto.CollectorNIC;
            collector.CollectorAddressLine1 = dto.CollectorAddressLine1;
            collector.CollectorAddressLine2 = dto.CollectorAddressLine2;
            collector.CollectorCity = dto.CollectorCity;
            collector.CollectorPostalCode = dto.CollectorPostalCode;
            collector.CollectorGender = dto.CollectorGender;
            collector.CollectorDOB = dto.CollectorDOB;
            collector.CollectorPhoneNum = dto.CollectorPhoneNum;
            collector.CollectorEmail = dto.CollectorEmail;

            await _context.SaveChangesAsync();
            return MapToDto(collector);
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
            // Use Include to load the vehicle for the single-item view
            var collector = await _context.Collectors
                .Include(c => c.Vehicle)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CollectorId == id);

            return collector == null ? null : MapToDto(collector);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var collector = await _context.Collectors.FindAsync(id);
            if (collector == null) return false;
            _context.Collectors.Remove(collector);
            await _context.SaveChangesAsync();
            return true;
        }

        private static CollectorResponseDto MapToDto(Collector c) => new()
        {
            CollectorId = c.CollectorId,
            Name = c.Name,
            RatePerKm = c.RatePerKm,
            CollectorNIC = c.CollectorNIC,
            CollectorAddressLine1 = c.CollectorAddressLine1,
            CollectorAddressLine2 = c.CollectorAddressLine2,
            CollectorCity = c.CollectorCity,
            CollectorPostalCode = c.CollectorPostalCode,
            CollectorGender = c.CollectorGender,
            CollectorDOB = c.CollectorDOB,
            CollectorPhoneNum = c.CollectorPhoneNum,
            CollectorEmail = c.CollectorEmail,
            VehicleId = c.Vehicle?.VehicleId,
            VehicleLicensePlate = c.Vehicle?.LicensePlate,
            VehicleVolume = (double?)c.Vehicle?.Volume
        };
    }
}