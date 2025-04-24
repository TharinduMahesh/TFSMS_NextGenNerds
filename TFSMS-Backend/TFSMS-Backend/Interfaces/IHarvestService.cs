using TFSMS_Backend.DTOs;

namespace TFSMS_Backend.Interfaces;

public interface IHarvestService
{
    Task<IEnumerable<HarvestDto>> GetAllAsync();
    Task<HarvestDto> AddAsync(HarvestDto harvestDto);
}
