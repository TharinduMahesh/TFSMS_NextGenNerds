using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly AppDbContext _context;

        public VehicleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<VehicleResponseDto> CreateAsync(CreateUpdateVehicleDto dto)
        {
            // 1. Validate collector exists.
            if (!await _context.Collectors.AnyAsync(c => c.CollectorId == dto.CollectorId))
            {
                throw new KeyNotFoundException($"Cannot create vehicle. Collector with ID {dto.CollectorId} not found.");
            }

            // 2. Validate license plate uniqueness.
            if (await _context.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate))
            {
                throw new InvalidOperationException($"A vehicle with license plate '{dto.LicensePlate}' already exists.");
            }

            // 3. Validate this collector doesn't already have a vehicle (one-to-one).
            // This is the line that had the syntax error.
            if (await _context.Vehicles.AnyAsync(v => v.CollectorId == dto.CollectorId))
            {
                throw new InvalidOperationException($"Collector with ID {dto.CollectorId} already has a vehicle assigned.");
            }

            var vehicle = new Vehicle
            {
                CollectorId = dto.CollectorId,
                LicensePlate = dto.LicensePlate,
                Volume = dto.Volume,
                Model = dto.Model,
                ConditionNotes = dto.ConditionNotes,
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return MapToDto(vehicle);
        }

        public async Task<VehicleResponseDto?> UpdateAsync(int id, CreateUpdateVehicleDto dto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return null;

            // Validations (Ensure these lines are also clean and correct)
            if (vehicle.CollectorId != dto.CollectorId && !await _context.Collectors.AnyAsync(c => c.CollectorId == dto.CollectorId))
            {
                throw new KeyNotFoundException($"Cannot update vehicle. Collector with ID {dto.CollectorId} not found.");
            }
            if (vehicle.LicensePlate != dto.LicensePlate && await _context.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate && v.VehicleId != id))
            {
                throw new InvalidOperationException($"Another vehicle with license plate '{dto.LicensePlate}' already exists.");
            }
            if (vehicle.CollectorId != dto.CollectorId && await _context.Vehicles.AnyAsync(v => v.CollectorId == dto.CollectorId && v.VehicleId != id))
            {
                throw new InvalidOperationException($"Collector with ID {dto.CollectorId} already has another vehicle assigned.");
            }

            // Update properties
            vehicle.CollectorId = dto.CollectorId;
            vehicle.LicensePlate = dto.LicensePlate;
            vehicle.Volume = dto.Volume;
            vehicle.Model = dto.Model;
            vehicle.ConditionNotes = dto.ConditionNotes;

            await _context.SaveChangesAsync();
            return MapToDto(vehicle);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return false;

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<VehicleResponseDto>> GetAllAsync()
        {
            return await _context.Vehicles
                .Select(v => MapToDto(v))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<VehicleResponseDto?> GetByIdAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            return vehicle == null ? null : MapToDto(vehicle);
        }

        private static VehicleResponseDto MapToDto(Vehicle vehicle)
        {
            return new VehicleResponseDto
            {
                VehicleId = vehicle.VehicleId,
                LicensePlate = vehicle.LicensePlate,
                Model = vehicle.Model,
                ConditionNotes = vehicle.ConditionNotes,
                Volume = vehicle.Volume,
                CollectorId = vehicle.CollectorId
            };
        }
    }
}