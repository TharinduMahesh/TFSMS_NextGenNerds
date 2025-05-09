//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TfactoryMng.Data;
//using TfactoryMng.Model;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using System;

//namespace TfactoryMng.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class RouteYieldMaintainController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public RouteYieldMaintainController(AppDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/RouteYieldMaintain
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<YieldList>>> GetAll()
//        {
//            try
//            {
//                var yields = await _context.YieldLists.Include(y => y.RtList).ToListAsync();
//                return Ok(yields);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        // GET: api/RouteYieldMaintain/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<YieldList>> GetById(int id)
//        {
//            try
//            {
//                var yield = await _context.YieldLists
//                    .Include(y => y.RtList)
//                    .FirstOrDefaultAsync(y => y.yId == id);

//                return yield == null ? NotFound($"Yield with ID {id} not found.") : Ok(yield);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error retrieving data: {ex.Message}");
//            }
//        }

//        // POST: api/RouteYieldMaintain
//        [HttpPost]
//        public async Task<ActionResult<YieldList>> Create(YieldList yield)
//        {
//            try
//            {
//                if (!await _context.RtLists.AnyAsync(r => r.rName == yield.rName))
//                {
//                    return BadRequest("Route does not exist");
//                }

//                _context.YieldLists.Add(yield);
//                await _context.SaveChangesAsync();

//                return CreatedAtAction(nameof(GetById), new { id = yield.yId }, yield);
//            }
//            catch (DbUpdateException dbEx)
//            {
//                return StatusCode(500, $"Database update error: {dbEx.Message}");
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error creating record: {ex.Message}");
//            }
//        }

//        // PUT: api/RouteYieldMaintain/5
//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, YieldList yield)
//        {
//            if (id != yield.yId)
//            {
//                return BadRequest("Mismatched ID");
//            }

//            try
//            {
//                if (!await _context.RtLists.AnyAsync(r => r.rName == yield.rName))
//                {
//                    return BadRequest("Route does not exist");
//                }

//                _context.Entry(yield).State = EntityState.Modified;
//                await _context.SaveChangesAsync();
//                return NoContent();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!YieldExists(id))
//                {
//                    return NotFound($"Yield with ID {id} does not exist.");
//                }
//                return StatusCode(500, "Concurrency error while updating yield.");
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error updating yield: {ex.Message}");
//            }
//        }

//        // DELETE: api/RouteYieldMaintain/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            try
//            {
//                var yield = await _context.YieldLists.FindAsync(id);
//                if (yield == null)
//                {
//                    return NotFound($"Yield with ID {id} not found.");
//                }

//                _context.YieldLists.Remove(yield);
//                await _context.SaveChangesAsync();
//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error deleting yield: {ex.Message}");
//            }
//        }

//        private bool YieldExists(int id)
//        {
//            return _context.YieldLists.Any(e => e.yId == id);
//        }
//    }
//}