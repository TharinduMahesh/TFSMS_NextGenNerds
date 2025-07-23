using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class TripRecordService : ITripRecordService
    {
        private readonly AppDbContext _context;

        public TripRecordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TripResponseDto> ScheduleTripAsync(ScheduleTripDto dto)
        {
            // Validations remain the same
            if (!await _context.RtLists.AnyAsync(r => r.rId == dto.RouteId))
                throw new KeyNotFoundException($"Route with ID {dto.RouteId} not found.");
            if (!await _context.Collectors.AnyAsync(c => c.CollectorId == dto.CollectorId))
                throw new KeyNotFoundException($"Route with ID {dto.RouteId} not found.");

            var newTrip = new TripRecord
            {
                RouteId = dto.RouteId,
                CollectorId = dto.CollectorId,
                ScheduledDeparture = dto.ScheduledDeparture,
                ScheduledArrival = dto.ScheduledArrival
            };

            _context.TripRecords.Add(newTrip);
            await _context.SaveChangesAsync();

            return await GetTripByIdAsync(newTrip.TripId)
                   ?? throw new InvalidOperationException("Could not retrieve newly created trip.");
        }

        public async Task<TripResponseDto?> UpdateTripStatusAsync(int tripId, UpdateTripStatusDto dto)
        {
            var trip = await _context.TripRecords.FindAsync(tripId);
            if (trip == null) return null;

            trip.ActualDeparture = dto.ActualDeparture ?? trip.ActualDeparture;
            trip.ActualArrival = dto.ActualArrival ?? trip.ActualArrival;

            await _context.SaveChangesAsync();

            return await GetTripByIdAsync(trip.TripId);
        }

        public async Task<IEnumerable<TripResponseDto>> GetAllTripsAsync()
        {
            return await _context.TripRecords
                .Include(t => t.Route)
                .Include(t => t.Collector)
                .Select(t => MapToDto(t))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TripResponseDto?> GetTripByIdAsync(int tripId)
        {
            return await _context.TripRecords
                .Where(t => t.TripId == tripId)
                .Include(t => t.Route)
                .Include(t => t.Collector)
                .Select(t => MapToDto(t))
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteTripAsync(int tripId)
        {
            var trip = await _context.TripRecords.FindAsync(tripId);
            if (trip == null) return false;

            _context.TripRecords.Remove(trip);
            await _context.SaveChangesAsync();
            return true;
        }

        private static TripResponseDto MapToDto(TripRecord t) => new()
        {
            TripId = t.TripId,
            RouteId = t.RouteId,
            RouteName = t.Route?.rName,
            CollectorId = t.CollectorId,
            CollectorName = t.Collector?.Name,
            ScheduledDeparture = t.ScheduledDeparture,
            // --- ADD THIS NEW MAPPING ---
            ScheduledArrival = t.ScheduledArrival,
            ActualDeparture = t.ActualDeparture,
            ActualArrival = t.ActualArrival,
            IsOnTime = t.IsOnTime
        };
    }
}