// Controllers/GrowerSignUpController.cs
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test6API.Data;
using test6API.Models;

namespace test6API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrowerSignUpController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GrowerSignUpController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(GrowerSignUp grower)
        {
            if (ModelState.IsValid)
            {
                _context.GrowerSignUps.Add(grower);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Grower signed up successfully" });
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var growers = _context.GrowerSignUps.ToList();
            return Ok(growers);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.GrowerSignUps.FirstOrDefaultAsync(u => u.GrowerEmail == request.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Email" });
            }

            if (user.GrowerPassword != request.Password)  // ⚠️ In real apps, password should be hashed
            {
                return Unauthorized(new { message = "Invalid Password" });
            }

            return Ok(new { message = "Login Successful", growerId = user.GrowerId });
        }
    }
}
