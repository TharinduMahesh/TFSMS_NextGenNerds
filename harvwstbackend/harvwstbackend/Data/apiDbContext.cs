using Microsoft.EntityFrameworkCore;
using harvestbackend.Modles;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) 
    { 
    }

    public DbSet<HarvestEntity> HarvestEntries { get; set; }
}
