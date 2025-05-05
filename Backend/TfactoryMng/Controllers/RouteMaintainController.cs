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

        public RouteMaintainController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RouteMaintain
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RtList>>> GetAll()
        {
            try
            {
                return await _context.RtLists.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        // GET: api/RouteMaintain/id
        [HttpGet("{id}")]
        public async Task<ActionResult<RtList>> GetById(int id)
        {
            try
            {
                var route = await _context.RtLists.FindAsync(id);
                return route == null ? NotFound("Route not found.") : Ok(route);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error retrieving route: {ex.Message}");
            }
        }

        // POST: api/RouteMaintain
        [HttpPost]
        public async Task<ActionResult<RtList>> Create(RtList route)
        {
            try
            {
                if (await _context.RtLists.AnyAsync(r => r.rName == route.rName))
                {
                    return BadRequest("Route with this name already exists.");
                }

                _context.RtLists.Add(route);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = route.id }, route);
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

        // PUT: api/RouteMaintain/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RtList route)
        {
            if (id != route.id)
            {
                return BadRequest("Route ID mismatch.");
            }

            try
            {
                var existingRoute = await _context.RtLists.FindAsync(id);
                if (existingRoute == null)
                {
                    return NotFound("Route not found.");
                }

                if (await _context.RtLists.AnyAsync(r => r.id != id && r.rName == route.rName))
                {
                    return BadRequest("Another route with this name already exists.");
                }

                _context.Entry(existingRoute).CurrentValues.SetValues(route);

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RouteExists(id))
                {
                    return NotFound("Route no longer exists.");
                }
                return StatusCode((int)HttpStatusCode.Conflict, "Concurrency conflict occurred.");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Update error: {ex.Message}");
            }
        }

        // DELETE: api/RouteMaintain/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var route = await _context.RtLists.FindAsync(id);
                if (route == null)
                {
                    return NotFound("Route not found.");
                }

                bool hasDependencies = await _context.YieldLists.AnyAsync(y => y.rName == route.rName)
                                    || await _context.TransportCosts.AnyAsync(t => t.rName == route.rName)
                                    || await _context.TransportPerformances.AnyAsync(t => t.rName == route.rName);

                if (hasDependencies)
                {
                    return BadRequest("Cannot delete route with related records.");
                }

                _context.RtLists.Remove(route);
                await _context.SaveChangesAsync();
                return NoContent();
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

        private bool RouteExists(int id)
        {
            return _context.RtLists.Any(e => e.id == id);
        }
    }
}
