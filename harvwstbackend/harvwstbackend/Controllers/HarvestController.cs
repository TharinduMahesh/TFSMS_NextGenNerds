using Microsoft.AspNetCore.Mvc;
using harvestbackend.Modles;

[ApiController]
[Route("api/[controller]")]
public class HarvestController : ControllerBase
{
    private readonly ApiDbContext _context;

    public HarvestController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostHarvest(HarvestEntity entry)
    {
        object value = _context.HarvestEntries.Add(entry);
        await _context.SaveChangesAsync();
        return Ok(entry);
    }
}
