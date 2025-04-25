// Controllers/RViewController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using RYtrack.Model;

namespace Rytrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RYtrackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RYtrackController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<YieldList>>> GetAll()
        {
            return await _context.YieldLists.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<YieldList>> Create(YieldList yieldList)
        {
            _context.YieldLists.Add(yieldList); 
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = yieldList.RouteId }, yieldList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<YieldList>> GetById(int id)
        {
            var yieldList = await _context.YieldLists.FindAsync(id);
            return yieldList == null ? NotFound() : Ok(yieldList);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var yieldList = await _context.YieldLists.FindAsync(id);
            if (yieldList == null)
            {
                return NotFound(); 
            }

            _context.YieldLists.Remove(yieldList);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }



    }
}
