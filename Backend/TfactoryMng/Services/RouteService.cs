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
                collectorId = routeDto.collectorId,
                vehicleId = routeDto.vehicleId,
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

        public async Task<bool> UpdateRouteAsync(int id, CreateUpdateRouteDto routeDto)
        {
            var existingRoute = await _context.RtLists
                .Include(r => r.GrowerLocations)
                .FirstOrDefaultAsync(r => r.rId == id);

            if (existingRoute == null)
            {
                return false;
            }

            // THIS IS THE PROBLEM AREA
            // It only updates rName and startLocation. All other properties are missed!
            existingRoute.rName = routeDto.rName;
            existingRoute.startLocation = routeDto.startLocation;
            // ... copy other properties ... // <-- This comment indicates the missing code.

            // The rest of the logic for growerLocations is fine.
            _context.GrowerLocations.RemoveRange(existingRoute.GrowerLocations);
            existingRoute.GrowerLocations = routeDto.GrowerLocations.Select(gl => new GrowerLocation
            {
                latitude = gl.latitude,
                longitude = gl.longitude,
                description = gl.description,
                RtListId = id
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
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