using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using text3.Models;
using text3.Data;
using Microsoft.EntityFrameworkCore;

namespace text3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OTransportController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OTransportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OTransport>>> Get()
        {
            var OTransports = await _context.OTransports.ToListAsync();
            return Ok(OTransports);
        }


        [HttpPost]
        public async Task<ActionResult<OTransport>> Post([FromBody] OTransport oTransport)
        {
            if (oTransport.TransportType == null || !Enum.IsDefined(typeof(TransportType), oTransport.TransportType))
            {
                return BadRequest("Invalid Transport Type. Valid values are 'Air', 'Sea', or 'Land'");
            }

            _context.OTransports.Add(oTransport);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = oTransport.OTransportId }, oTransport);
        }
    }
}
