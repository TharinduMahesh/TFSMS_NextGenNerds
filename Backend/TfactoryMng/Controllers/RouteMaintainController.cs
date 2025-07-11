
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
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateRouteDto routeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _routeService.UpdateRouteAsync(id, routeDto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _routeService.DeleteRouteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}