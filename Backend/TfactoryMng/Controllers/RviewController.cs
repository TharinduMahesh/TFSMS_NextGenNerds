// Controllers/RViewController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using Rviewmodel.Model;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RViewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RViewController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/rview
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rview>>> GetAll()
        {
            return await _context.Rviews.ToListAsync();
        }

        // GET: api/rview/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rview>> GetById(int id)
        {
            var rview = await _context.Rviews.FindAsync(id);
            return rview == null ? NotFound() : Ok(rview);
        }

        // POST: api/rview
        [HttpPost]
        public async Task<ActionResult<Rview>> Create(Rview rview)
        {
            _context.Rviews.Add(rview);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = rview.Id }, rview);
        }

        // PUT: api/rview/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Rview rview)
        {
            if (id != rview.Id) return BadRequest();

            _context.Entry(rview).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RviewExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/rview/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var rview = await _context.Rviews.FindAsync(id);
            if (rview == null) return NotFound();

            _context.Rviews.Remove(rview);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool RviewExists(int id)
        {
            return _context.Rviews.Any(e => e.Id == id);
        }
    }
}