// Controllers/RouteYieldMaintainController.cs
using Microsoft.AspNetCore.Mvc;
using TfactoryMng.DTOs;
using TfactoryMng.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteYieldMaintainController : ControllerBase
    {
        private readonly IYieldService _yieldService;
        private readonly ILogger<RouteYieldMaintainController> _logger;

        public RouteYieldMaintainController(IYieldService yieldService, ILogger<RouteYieldMaintainController> logger)
        {
            _yieldService = yieldService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<YieldResponseDto>>> GetAll()
        {
            var yields = await _yieldService.GetAllYieldsAsync();
            return Ok(yields);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<YieldResponseDto>> GetById(int id)
        {
            var yield = await _yieldService.GetYieldByIdAsync(id);
            return yield == null ? NotFound($"Yield with ID {id} not found") : Ok(yield);
        }

        [HttpPost]
        public async Task<ActionResult<YieldResponseDto>> Create([FromBody] CreateUpdateYieldDto yieldDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var newYield = await _yieldService.CreateYieldAsync(yieldDto);
                return CreatedAtAction(nameof(GetById), new { id = newYield.yId }, newYield);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error creating yield");
                return StatusCode(500, "An internal error occurred while creating the yield.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateYieldDto yieldDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var updatedYield = await _yieldService.UpdateYieldAsync(id, yieldDto);
                return updatedYield == null ? NotFound($"Yield with ID {id} not found") : Ok(updatedYield);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"Error updating yield {id}");
                return StatusCode(500, "An internal error occurred while updating the yield.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _yieldService.DeleteYieldAsync(id);
            return success ? NoContent() : NotFound($"Yield with ID {id} not found");
        }
    }
}