
using Microsoft.AspNetCore.Mvc;
using TfactoryMng.DTOs;
using TfactoryMng.Services;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteMaintainController : ControllerBase
    {
        private readonly IRouteService _routeService;
        private readonly ILogger<RouteMaintainController> _logger;

        public RouteMaintainController(IRouteService routeService, ILogger<RouteMaintainController> logger)
        {
            _routeService = routeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var routes = await _routeService.GetAllRoutesAsync();
            return Ok(routes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var route = await _routeService.GetRouteByIdAsync(id);
            return route == null ? NotFound() : Ok(route);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUpdateRouteDto routeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var newRoute = await _routeService.CreateRouteAsync(routeDto);
                return CreatedAtAction(nameof(GetById), new { id = newRoute.rId }, newRoute);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating route");
                return StatusCode(500, "An internal error occurred");
            }
        }

        [HttpPut("{id}")]
        // CHANGE THIS ACTION:
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateRouteDto routeDto)
        {
            // The [ApiController] attribute handles this for you, but it's good practice
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // The service now returns the updated object or null
            var updatedRoute = await _routeService.UpdateRouteAsync(id, routeDto);

            if (updatedRoute == null)
            {
                return NotFound($"Route with ID {id} not found.");
            }

            // On success, return a 200 OK with the updated route data in the body
            return Ok(updatedRoute);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _routeService.DeleteRouteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}