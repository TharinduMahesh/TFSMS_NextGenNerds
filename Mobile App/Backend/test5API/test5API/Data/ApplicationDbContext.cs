using Microsoft.EntityFrameworkCore;
using test5API.Models;

namespace test5API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Grower> Growers { get; set; }
    }
}
