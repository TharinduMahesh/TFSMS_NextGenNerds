using TFSMS_Backend.Data;
using TFSMS_Backend.DTOs;
using TFSMS_Backend.Interfaces;
using TFSMS_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace TFSMS_Backend.Services;

public class HarvestService : IHarvestService
{
    private readonly AppDbContext _context;

    public HarvestService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HarvestDto>> GetAllAsync()
    {
        return await _context.Harvests.Select(h => new HarvestDto
        {
            HarvestDate = h.HarvestDate,
            SuperLeafWeight = h.SuperLeafWeight,
            NormalLeafWeight = h.NormalLeafWeight,
            TransportMethod = h.TransportMethod,
            PaymentMethod = h.PaymentMethod
        }).ToListAsync();
    }

    public async Task<HarvestDto> AddAsync(HarvestDto dto)
    {
        var harvest = new Harvest
        {
            HarvestDate = dto.HarvestDate,
            SuperLeafWeight = dto.SuperLeafWeight,
            NormalLeafWeight = dto.NormalLeafWeight,
            TransportMethod = dto.TransportMethod,
            PaymentMethod = dto.PaymentMethod
        };

        _context.Harvests.Add(harvest);
        await _context.SaveChangesAsync();
        return dto;
    }
}
