using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public interface IRouteService
    {
        Task<IEnumerable<RtList>> GetAllRoutesAsync();
        Task<RtList?> GetRouteByIdAsync(int id);
        Task<RtList> CreateRouteAsync(CreateUpdateRouteDto routeDto);
        Task<bool> UpdateRouteAsync(int id, CreateUpdateRouteDto routeDto);
        Task<bool> DeleteRouteAsync(int id);
    }
}