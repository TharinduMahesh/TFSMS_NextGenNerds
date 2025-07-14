using TfactoryMng.DTOs;

namespace TfactoryMng.Services
{
    public interface ICollectorService
    {
        Task<IEnumerable<CollectorResponseDto>> GetAllAsync();
        Task<CollectorResponseDto?> GetByIdAsync(int id);
        Task<CollectorResponseDto> CreateAsync(CreateUpdateCollectorDto dto);
        Task<CollectorResponseDto?> UpdateAsync(int id, CreateUpdateCollectorDto dto);
        Task<bool> DeleteAsync(int id);
    }
}