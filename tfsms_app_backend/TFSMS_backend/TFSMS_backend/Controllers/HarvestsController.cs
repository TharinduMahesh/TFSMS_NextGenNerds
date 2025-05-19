using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TFSMS_app_backend.Data;
using TFSMS_app_backend.Models;

namespace TFSMS_app_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HarvestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HarvestController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Harvest
        [HttpPost]
        public async Task<IActionResult> CreateHarvest([FromBody] Harvest harvest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            harvest.Id = Guid.NewGuid(); // Ensure a new GUID is assigned
            harvest.Status = "Pending";
            _context.Harvests.Add(harvest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHarvestById), new { id = harvest.Id }, harvest);
        }

        // GET: api/Harvest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Harvest>> GetHarvestById(Guid id)
        {
            var harvest = await _context.Harvests.FindAsync(id);
            if (harvest == null)
                return NotFound();

            return harvest;
        }

        // PUT: api/Harvest/{id}/confirm
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmHarvest(Guid id)
        {
            var harvest = await _context.Harvests.FindAsync(id);
            if (harvest == null)
                return NotFound();

            harvest.Status = "Accepted";
            await _context.SaveChangesAsync();

            return Ok(harvest);
        }

        // GET: api/Harvest/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Harvest>>> GetPendingHarvests()
        {
            return await _context.Harvests
                                 .Where(h => h.Status == "Pending")
                                 .ToListAsync();
        }
    }
}
