using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ILogger<RouteMaintainController> _logger;

        public RouteMaintainController(AppDbContext context, ILogger<RouteMaintainController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RtList>>> GetAll()
        {
            try
            {
                var routes = await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(routes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all routes");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving route data");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RtList>> GetById(int id)
        {
            try
            {
                var route = await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r => r.rId == id);

                return route == null
                    ? NotFound($"Route with ID {id} not found")
                    : Ok(route);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving route with ID {id}");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving route details");
            }
        }

        [HttpPost]
        public async Task<ActionResult<RtList>> Create(RtList route)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (await _context.RtLists.AnyAsync(r => r.rName == route.rName))
                    return Conflict($"Route '{route.rName}' already exists");

                if (route.GrowerLocations != null)
                {
                    foreach (var location in route.GrowerLocations)
                    {
                        location.RtList = route;
                    }
                }

                _context.RtLists.Add(route);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = route.rId }, route);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating route");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Failed to save route data");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating route");
                return StatusCode((int)HttpStatusCode.InternalServerError, "An unexpected error occurred");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RtList route)
        {
            try
            {
                if (id != route.rId)
                    return BadRequest("Route ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingRoute = await _context.RtLists
                    .Include(r => r.GrowerLocations)
                    .FirstOrDefaultAsync(r => r.rId == id);

                if (existingRoute == null)
                    return NotFound($"Route with ID {id} not found");

                _context.Entry(existingRoute).CurrentValues.SetValues(route);
                _context.GrowerLocations.RemoveRange(existingRoute.GrowerLocations);

                if (route.GrowerLocations != null)
                {
                    foreach (var location in route.GrowerLocations)
                    {
                        location.RtListId = id;
                        _context.GrowerLocations.Add(location);
                    }
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode((int)HttpStatusCode.Conflict, "Concurrency conflict detected");
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Database error updating route {id}");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Failed to update route");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error updating route {id}");
                return StatusCode((int)HttpStatusCode.InternalServerError, "An unexpected error occurred");
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
                    return NotFound($"Route with ID {id} not found");

                _context.RtLists.Remove(route);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Database error deleting route {id}");
                return StatusCode((int)HttpStatusCode.InternalServerError, "Failed to delete route");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error deleting route {id}");
                return StatusCode((int)HttpStatusCode.InternalServerError, "An unexpected error occurred");
            }
        }
    }
}