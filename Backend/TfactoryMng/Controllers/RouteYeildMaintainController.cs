using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TfactoryMng.Data;
using TfactoryMng.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace TfactoryMng.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteYieldMaintainController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RouteYieldMaintainController> _logger;

        public RouteYieldMaintainController(AppDbContext context, ILogger<RouteYieldMaintainController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/RouteYieldMaintain
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            try
            {
                var yields = await _context.YieldLists
                    .Include(y => y.RtList)
                    .Select(y => new
                    {
                        y.yId,
                        y.rId,
                        y.RtList.rName,
                        y.collected_Yield,
                        y.golden_Tips_Present,
                        collectorID = y.RtList.collectorId,
                        vehicleID = y.RtList.vehicleId
                    })
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(yields);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all yields");
                return StatusCode(500, new
                {
                    Message = "An error occurred while retrieving yields",
                    Details = ex.Message
                });
            }
        }

        // GET: api/RouteYieldMaintain/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetById(int id)
        {
            try
            {
                var yield = await _context.YieldLists
                    .Include(y => y.RtList)
                    .Where(y => y.yId == id)
                    .Select(y => new
                    {
                        y.yId,
                        y.rId,
                        y.RtList.rName,
                        y.collected_Yield,
                        y.golden_Tips_Present,
                        collectorID = y.RtList.collectorId,
                        vehicleID = y.RtList.vehicleId
                    })
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (yield == null)
                {
                    return NotFound(new
                    {
                        Message = $"Yield with ID {id} not found",
                        Id = id
                    });
                }

                return Ok(yield);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving yield with ID {id}");
                return StatusCode(500, new
                {
                    Message = $"An error occurred while retrieving yield with ID {id}",
                    Details = ex.Message
                });
            }
        }

        // POST: api/RouteYieldMaintain
        [HttpPost]
        public async Task<ActionResult<YieldList>> Create([FromBody] YieldList yield)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Message = "Invalid yield data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors)
                });
            }

            try
            {
                // Verify route exists
                var route = await _context.RtLists
                    .FirstOrDefaultAsync(r => r.rId == yield.rId);

                if (route == null)
                {
                    return BadRequest(new
                    {
                        Message = "Route validation failed",
                        Errors = new[] { $"Route with ID {yield.rId} does not exist" }
                    });
                }

                _context.YieldLists.Add(yield);
                await _context.SaveChangesAsync();

                // Return the created yield with route details
                var result = new
                {
                    yield.yId,
                    yield.rId,
                    route.rName,
                    yield.collected_Yield,
                    yield.golden_Tips_Present,
                    collectorID = route.collectorId,
                    vehicleID = route.vehicleId
                };

                return CreatedAtAction(nameof(GetById), new { id = yield.yId }, new
                {
                    Data = result,
                    Message = "Yield created successfully"
                });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating yield");
                return StatusCode(500, new
                {
                    Message = "Failed to create yield due to database error",
                    Details = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating yield");
                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred while creating yield",
                    Details = ex.Message
                });
            }
        }

        // PUT: api/RouteYieldMaintain/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] YieldList yield)
        {
            if (id != yield.yId)
            {
                return BadRequest(new
                {
                    Message = "ID mismatch",
                    Errors = new[] { $"Yield ID {id} does not match ID {yield.yId}" }
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Message = "Invalid yield data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors)
                });
            }

            try
            {
                // Verify route exists
                var route = await _context.RtLists
                    .FirstOrDefaultAsync(r => r.rId == yield.rId);

                if (route == null)
                {
                    return BadRequest(new
                    {
                        Message = "Route validation failed",
                        Errors = new[] { $"Route with ID {yield.rId} does not exist" }
                    });
                }

                _context.Entry(yield).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!YieldExists(id))
                    {
                        return NotFound(new
                        {
                            Message = $"Yield with ID {id} not found",
                            Id = id
                        });
                    }
                    throw;
                }

                // Return the updated yield with route details
                var result = new
                {
                    yield.yId,
                    yield.rId,
                    route.rName,
                    yield.collected_Yield,
                    yield.golden_Tips_Present,
                    collectorID = route.collectorId,
                    vehicleID = route.vehicleId
                };

                return Ok(new
                {
                    Data = result,
                    Message = "Yield updated successfully"
                });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, $"Database error while updating yield with ID {id}");
                return StatusCode(500, new
                {
                    Message = $"Failed to update yield with ID {id} due to database error",
                    Details = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while updating yield with ID {id}");
                return StatusCode(500, new
                {
                    Message = $"An unexpected error occurred while updating yield with ID {id}",
                    Details = ex.Message
                });
            }
        }

        // DELETE: api/RouteYieldMaintain/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var yield = await _context.YieldLists.FindAsync(id);
                if (yield == null)
                {
                    return NotFound(new
                    {
                        Message = $"Yield with ID {id} not found",
                        Id = id
                    });
                }

                _context.YieldLists.Remove(yield);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = $"Yield with ID {id} deleted successfully",
                    Id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, $"Database error while deleting yield with ID {id}");
                return StatusCode(500, new
                {
                    Message = $"Failed to delete yield with ID {id} due to database error",
                    Details = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while deleting yield with ID {id}");
                return StatusCode(500, new
                {
                    Message = $"An unexpected error occurred while deleting yield with ID {id}",
                    Details = ex.Message
                });
            }
        }

        private bool YieldExists(int id)
        {
            return _context.YieldLists.Any(e => e.yId == id);
        }
    }
}