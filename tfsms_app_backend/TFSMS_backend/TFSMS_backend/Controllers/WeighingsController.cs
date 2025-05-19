using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TFSMS_app_backend.Data;
using TFSMS_app_backend.Models;

namespace TFSMS_app_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeighingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WeighingsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: Create weighing
        [HttpPost]
        public async Task<IActionResult> Create(Weighing weighing)
        {
            _context.Weighings.Add(weighing);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = weighing.Id }, weighing);
        }

        // GET: All weighings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Weighing>>> GetAll()
        {
            return await _context.Weighings.ToListAsync();
        }

        // GET: By ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Weighing>> GetById(int id)
        {
            var weighing = await _context.Weighings.FindAsync(id);
            return weighing == null ? NotFound() : Ok(weighing);
        }

        // PUT: Confirm a weighing
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            var weighing = await _context.Weighings.FindAsync(id);
            if (weighing == null) return NotFound();

            weighing.IsConfirmed = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: Edit/update a weighing
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Weighing updated)
        {
            if (id != updated.Id) return BadRequest();

            var weighing = await _context.Weighings.FindAsync(id);
            if (weighing == null) return NotFound();

            weighing.SupplierName = updated.SupplierName;
            weighing.SupplierId = updated.SupplierId;
            weighing.GrossWeight = updated.GrossWeight;
            weighing.Deductions = updated.Deductions;
            weighing.SackCount = updated.SackCount;
            weighing.ContainerId = updated.ContainerId;
            weighing.IsConfirmed = updated.IsConfirmed;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
