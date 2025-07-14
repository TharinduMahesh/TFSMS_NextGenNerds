using Microsoft.AspNetCore.Mvc;
using TfactoryMng.DTOs;
using TfactoryMng.Services;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripRecordsController : ControllerBase
    {
        private readonly ITripRecordService _tripService;

        public TripRecordsController(ITripRecordService tripService)
        {
            _tripService = tripService;
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleTrip(ScheduleTripDto dto)
        {
            try
            {
                var newTrip = await _tripService.ScheduleTripAsync(dto);
                return CreatedAtAction(nameof(GetTrip), new { tripId = newTrip.TripId }, newTrip);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{tripId}/status")]
        public async Task<IActionResult> UpdateTripStatus(int tripId, UpdateTripStatusDto dto)
        {
            var updatedTrip = await _tripService.UpdateTripStatusAsync(tripId, dto);
            return updatedTrip == null ? NotFound() : Ok(updatedTrip);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _tripService.GetAllTripsAsync();
            return Ok(trips);
        }

        [HttpGet("{tripId}")]
        public async Task<IActionResult> GetTrip(int tripId)
        {
            var trip = await _tripService.GetTripByIdAsync(tripId);
            return trip == null ? NotFound() : Ok(trip);
        }

        [HttpDelete("{tripId}")]
        public async Task<IActionResult> DeleteTrip(int tripId)
        {
            var success = await _tripService.DeleteTripAsync(tripId);
            return success ? NoContent() : NotFound();
        }
    }
}