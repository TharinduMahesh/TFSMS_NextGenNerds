// Services/IYieldService.cs
using TfactoryMng.DTOs;

namespace TfactoryMng.Services
{
    public interface IYieldService
    {
        Task<IEnumerable<YieldResponseDto>> GetAllYieldsAsync();
        Task<YieldResponseDto?> GetYieldByIdAsync(int id);
        Task<YieldResponseDto> CreateYieldAsync(CreateUpdateYieldDto yieldDto);
        Task<YieldResponseDto?> UpdateYieldAsync(int id, CreateUpdateYieldDto yieldDto);
        Task<bool> DeleteYieldAsync(int id);
    }
}