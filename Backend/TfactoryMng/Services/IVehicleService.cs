using TfactoryMng.DTOs;

namespace TfactoryMng.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleResponseDto>> GetAllAsync();
        Task<VehicleResponseDto?> GetByIdAsync(int id);
        Task<VehicleResponseDto> CreateAsync(CreateUpdateVehicleDto dto);
        Task<VehicleResponseDto?> UpdateAsync(int id, CreateUpdateVehicleDto dto);
        Task<bool> DeleteAsync(int id);
    }
}