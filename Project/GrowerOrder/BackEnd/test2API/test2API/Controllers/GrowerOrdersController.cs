using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test2API.Data;
using test2API.Models;

namespace test2API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrowerOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GrowerOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GrowerOrder>>> GetGrowerOrders()
        {
            return await _context.GrowerOrders.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GrowerOrder>> GetGrowerOrder(int id)
        {
            var order = await _context.GrowerOrders.FindAsync(id);
            if (order == null) return NotFound();
            return order;
        }

        [HttpPost]
        public async Task<ActionResult<GrowerOrder>> PostGrowerOrder(GrowerOrder order)
        {
            _context.GrowerOrders.Add(order);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGrowerOrder), new { id = order.GrowerOrderId }, order);
        }

    }
}
