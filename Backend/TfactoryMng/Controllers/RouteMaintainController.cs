using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using TfactoryMng.Data;
using TfactoryMng.Model;
using System.Net;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteMaintainController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RouteMaintainController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RtList>>> GetAll()
        {
            try
            {
                return await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RtList>> GetById(int id)
        {
            try
            {
                var route = await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .FirstOrDefaultAsync(r => r.rId == id);

                return route == null ? NotFound("Route not found.") : Ok(route);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving route: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<RtList>> Create(RtList route)
        {
            try
            {
                if (await _context.RtLists.AnyAsync(r => r.rName == route.rName))
                {
                    return BadRequest("Route with this name already exists.");
                }

                if (route.GrowerLocations != null && route.GrowerLocations.Any())
                {
                    foreach (var loc in route.GrowerLocations)
                    {
                        loc.RtList = route;
                    }
                }

                _context.RtLists.Add(route);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = route.rId }, route);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Unexpected error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RtList route)
        {
            if (id != route.rId)
            {
                return BadRequest("Route ID mismatch.");
            }

            var existingRoute = await _context.RtLists
                .Include(r => r.GrowerLocations)
                .FirstOrDefaultAsync(r => r.rId == id);

            if (existingRoute == null)
            {
                return NotFound("Route not found.");
            }

            try
            {
                _context.Entry(existingRoute).CurrentValues.SetValues(route);
                _context.GrowerLocations.RemoveRange(existingRoute.GrowerLocations);

                foreach (var location in route.GrowerLocations)
                {
                    location.RtListId = id;
                    _context.GrowerLocations.Add(location);
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error updating route: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var route = await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .FirstOrDefaultAsync(r => r.rId == id);

                if (route == null)
                {
                    return NotFound("Route not found.");
                }

                _context.RtLists.Remove(route);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }
    }
}