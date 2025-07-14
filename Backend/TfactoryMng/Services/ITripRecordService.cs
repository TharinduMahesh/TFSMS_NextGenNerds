using TfactoryMng.DTOs;

namespace TfactoryMng.Services
{
    public interface ITripRecordService
    {
        Task<IEnumerable<TripResponseDto>> GetAllTripsAsync();
        Task<TripResponseDto?> GetTripByIdAsync(int tripId);
        Task<TripResponseDto> ScheduleTripAsync(ScheduleTripDto dto);
        Task<TripResponseDto?> UpdateTripStatusAsync(int tripId, UpdateTripStatusDto dto);
        Task<bool> DeleteTripAsync(int tripId);
    }
}