using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.Model;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransportCostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransportCostController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TransportCost
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransportCost>>> GetAll()
        {
            return await _context.TransportCosts
                .Include(t => t.RtList)
                .ToListAsync();
        }

        // GET: api/TransportCost/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransportCost>> GetById(int id)
        {
            var transportCost = await _context.TransportCosts
                .Include(t => t.RtList)
                .FirstOrDefaultAsync(t => t.id == id);

            return transportCost == null ? NotFound() : Ok(transportCost);
        }

        // POST: api/TransportCost
        [HttpPost]
        public async Task<ActionResult<TransportCost>> Create(TransportCost transportCost)
        {
            if (!await _context.RtLists.AnyAsync(r => r.rName == transportCost.rName))
            {
                return BadRequest("Route does not exist");
            }

            _context.TransportCosts.Add(transportCost);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = transportCost.id }, transportCost);
        }

        // PUT: api/TransportCost/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TransportCost transportCost)
        {
            if (id != transportCost.id)
            {
                return BadRequest();
            }

            if (!await _context.RtLists.AnyAsync(r => r.rName == transportCost.rName))
            {
                return BadRequest("Route does not exist");
            }

            _context.Entry(transportCost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransportCostExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/TransportCost/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transportCost = await _context.TransportCosts.FindAsync(id);
            if (transportCost == null)
            {
                return NotFound();
            }

            _context.TransportCosts.Remove(transportCost);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TransportCostExists(int id)
        {
            return _context.TransportCosts.Any(e => e.id == id);
        }
    }
}