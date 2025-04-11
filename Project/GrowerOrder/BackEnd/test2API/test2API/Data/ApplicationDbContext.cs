using Microsoft.EntityFrameworkCore;
using test2API.Models;

namespace test2API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<GrowerOrder> GrowerOrders { get; set; }
    }
}
