using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using text3.Models;
using text3.Data;
using Microsoft.EntityFrameworkCore;

namespace text3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> Get()
        {
            var Payments = await _context.Payments.ToListAsync();
            return Ok(Payments);
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> Post([FromBody] Payment payment)
        {
            if (!Enum.IsDefined(typeof(PaymentMethod), payment.PaymentMethod))
            {
                return BadRequest("Invalid Transport Type. Valid values are 'Air' or 'Sea' or 'Land'");
            }

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = payment.PaymentId }, payment);
        }
    }
}
