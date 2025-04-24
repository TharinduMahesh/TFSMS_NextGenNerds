using TFSMS_Backend.DTOs;
using TFSMS_Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace HarvestApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HarvestController : ControllerBase
{
    private readonly IHarvestService _harvestService;

    public HarvestController(IHarvestService harvestService)
    {
        _harvestService = harvestService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _harvestService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] HarvestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _harvestService.AddAsync(dto);
        return Ok(created);
    }
}
