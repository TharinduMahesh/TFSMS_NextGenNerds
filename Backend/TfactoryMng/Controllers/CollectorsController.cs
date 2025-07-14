using Microsoft.AspNetCore.Mvc;
using TfactoryMng.DTOs;
using TfactoryMng.Services;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CollectorsController : ControllerBase
    {
        private readonly ICollectorService _collectorService;

        public CollectorsController(ICollectorService collectorService)
        {
            _collectorService = collectorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var collectors = await _collectorService.GetAllAsync();
            return Ok(collectors);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUpdateCollectorDto dto)
        {
            var newCollector = await _collectorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newCollector.CollectorId }, newCollector);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var collector = await _collectorService.GetByIdAsync(id);
            return collector == null ? NotFound() : Ok(collector);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateUpdateCollectorDto dto)
        {
            var updatedCollector = await _collectorService.UpdateAsync(id, dto);
            return updatedCollector == null ? NotFound() : Ok(updatedCollector);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _collectorService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}