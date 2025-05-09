//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TfactoryMng.Data;
//using TfactoryMng.Model;

//namespace TfactoryMng.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class TransportPerformanceController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public TransportPerformanceController(AppDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/TransportPerformance
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<TransportPerformance>>> GetAll()
//        {
//            return await _context.TransportPerformances.Include(t => t.TransportCost)
//                .ToListAsync();
//        }

//        // GET: api/TransportPerformance/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<TransportPerformance>> GetById(int id)
//        {
//            var performance = await _context.TransportPerformances
//                .Include(t => t.RtList)
//                .Include(t => t.TransportCost)
//                .FirstOrDefaultAsync(t => t.tpid == id);

//            return performance == null ? NotFound() : Ok(performance);
//        }

//        // POST: api/TransportPerformance
//        [HttpPost]
//        public async Task<ActionResult<TransportPerformance>> Create(TransportPerformance performance)
//        {
//            if (!await _context.RtLists.AnyAsync(r => r.rName == performance.rName))
//            {
//                return BadRequest("Route does not exist");
//            }

//            if (!await _context.TransportCosts.AnyAsync(tc => tc.tId == performance.TransportCostId))
//            {
//                return BadRequest("Transport cost does not exist");
//            }

//            performance.isOnTime = performance.arrivalTime <= performance.scheduledTime;

//            _context.TransportPerformances.Add(performance);
//            await _context.SaveChangesAsync();
//            return CreatedAtAction(nameof(GetById), new { id = performance.tpid }, performance);
//        }

//        // PUT: api/TransportPerformance/5
//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, TransportPerformance performance)
//        {
//            if (id != performance.tpid)
//            {
//                return BadRequest();
//            }

//            if (!await _context.RtLists.AnyAsync(r => r.rName == performance.rName))
//            {
//                return BadRequest("Route does not exist");
//            }

//            if (!await _context.TransportCosts.AnyAsync(tc => tc.tId == performance.TransportCostId))
//            {
//                return BadRequest("Transport cost does not exist");
//            }

//            performance.isOnTime = performance.arrivalTime <= performance.scheduledTime;
//            _context.Entry(performance).State = EntityState.Modified;

//            try
//            {
//                await _context.SaveChangesAsync();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!TransportPerformanceExists(id))
//                {
//                    return NotFound();
//                }
//                throw;
//            }

//            return NoContent();
//        }

//        // DELETE: api/TransportPerformance/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var performance = await _context.TransportPerformances.FindAsync(id);
//            if (performance == null)
//            {
//                return NotFound();
//            }

//            _context.TransportPerformances.Remove(performance);
//            await _context.SaveChangesAsync();
//            return NoContent();
//        }

//        private bool TransportPerformanceExists(int id)
//        {
//            return _context.TransportPerformances.Any(e => e.tpid == id);
//        }
//    }
//}