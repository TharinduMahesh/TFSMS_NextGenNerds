using Microsoft.EntityFrameworkCore;
using TFSMS_app_backend.Models;

namespace TFSMS_app_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Harvest> Harvests { get; set; }
        public DbSet<Weighing> Weighings { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
    }
}
