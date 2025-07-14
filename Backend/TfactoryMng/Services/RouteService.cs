// Services/RouteService.cs
using Microsoft.EntityFrameworkCore;

using TfactoryMng.Data;
using TfactoryMng.DTOs;
using TfactoryMng.Model;

namespace TfactoryMng.Services
{
    public class RouteService : IRouteService
    {
        private readonly AppDbContext _context;

        public RouteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RtList>> GetAllRoutesAsync()
        {
            return await _context.RtLists
                .Include(r => r.GrowerLocations)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<RtList?> GetRouteByIdAsync(int id)
        {
            return await _context.RtLists
                .Include(r => r.GrowerLocations)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.rId == id);
        }

        public async Task<RtList> CreateRouteAsync(CreateUpdateRouteDto routeDto)
        {
            if (await _context.RtLists.AnyAsync(r => r.rName == routeDto.rName))
            {
                // Custom exceptions are a great way to handle this
                throw new InvalidOperationException($"Route '{routeDto.rName}' already exists");
            }

            var route = new RtList
            {
                rName = routeDto.rName,
                startLocation = routeDto.startLocation,
                endLocation = routeDto.endLocation,
                distance = routeDto.distance,
                CollectorId = routeDto.CollectorId,
                GrowerLocations = routeDto.GrowerLocations.Select(gl => new GrowerLocation
                {
                    latitude = gl.latitude,
                    longitude = gl.longitude,
                    description = gl.description
                }).ToList()
            };

            _context.RtLists.Add(route);
            await _context.SaveChangesAsync();
            return route;
        }

        // In Services/RouteService.cs

        // In Services/RouteService.cs

        public async Task<RtList?> UpdateRouteAsync(int id, CreateUpdateRouteDto routeDto)
        {
            // 1. Find the existing route, including its child locations to update them
            var existingRoute = await _context.RtLists
                .Include(r => r.GrowerLocations)
                .FirstOrDefaultAsync(r => r.rId == id);

            // 2. If not found, return null
            if (existingRoute == null)
            {
                return null;
            }

            // 3. Update the properties of the existing entity from the DTO
            existingRoute.rName = routeDto.rName;
            existingRoute.startLocation = routeDto.startLocation;
            existingRoute.endLocation = routeDto.endLocation;
            existingRoute.distance = routeDto.distance;
            existingRoute.CollectorId = routeDto.CollectorId;

            // 4. Handle the child collection (a common pattern is "delete and re-add")
            _context.GrowerLocations.RemoveRange(existingRoute.GrowerLocations);
            existingRoute.GrowerLocations = routeDto.GrowerLocations.Select(gl => new GrowerLocation
            {
                latitude = gl.latitude,
                longitude = gl.longitude,
                description = gl.description
                // RtListId will be set automatically by EF Core
            }).ToList();

            // 5. Save the changes to the database
            await _context.SaveChangesAsync();

            // 6. Return the updated entity
            return existingRoute;
        }

        public async Task<bool> DeleteRouteAsync(int id)
        {
            var route = await _context.RtLists.FindAsync(id);
            if (route == null)
            {
                return false;
            }

            _context.RtLists.Remove(route);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}