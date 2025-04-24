using TFSMS_Backend.Models;
using Microsoft.EntityFrameworkCore;
using TFSMS_Backend.Models;

namespace TFSMS_Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Harvest> Harvests { get; set; }
}
