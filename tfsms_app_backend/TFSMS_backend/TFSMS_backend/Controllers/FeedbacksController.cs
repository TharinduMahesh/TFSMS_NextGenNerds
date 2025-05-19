using Microsoft.AspNetCore.Mvc;
using TFSMS_app_backend.Data;
using TFSMS_app_backend.Models;

namespace TFSMS_app_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbacksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostFeedback([FromBody] Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostFeedback), new { id = feedback.Id }, feedback);
        }
    }
}
