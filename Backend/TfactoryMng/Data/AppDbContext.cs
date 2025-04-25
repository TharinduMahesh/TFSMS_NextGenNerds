using Microsoft.EntityFrameworkCore;
using Rviewmodel.Model;
using RYtrack.Model;

namespace TfactoryMng.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Rview> Rviews { get; set; }

        public DbSet<YieldList> YieldLists { get; set; }

    }
}