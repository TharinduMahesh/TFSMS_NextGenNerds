using Microsoft.EntityFrameworkCore;
using text3.Models;

namespace text3.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Add DbSet properties for your models
        public DbSet<Order> Orders { get; set; }
        public DbSet<OTransport> OTransports { get; set; }
        public DbSet<Payment> Payments { get; set; }
    }
}