using Microsoft.AspNetCore.Mvc;
using TfactoryMng.DTOs;
using TfactoryMng.Services;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vehicles = await _vehicleService.GetAllAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vehicle = await _vehicleService.GetByIdAsync(id);
            return vehicle == null ? NotFound() : Ok(vehicle);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUpdateVehicleDto dto)
        {
            try
            {
                var newVehicle = await _vehicleService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = newVehicle.VehicleId }, newVehicle);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateUpdateVehicleDto dto)
        {
            try
            {
                var updatedVehicle = await _vehicleService.UpdateAsync(id, dto);
                return updatedVehicle == null ? NotFound() : Ok(updatedVehicle);
            }
            // --- ADD THIS CATCH BLOCK ---
            catch (KeyNotFoundException ex)
            {
                // This catches the "Collector not found" error
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _vehicleService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}