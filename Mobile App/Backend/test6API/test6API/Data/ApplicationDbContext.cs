using Microsoft.EntityFrameworkCore;
using test6API.Models;

namespace test6API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options) { }

        public DbSet<GrowerSignUp> GrowerSignUps { get; set; }
        public DbSet<GrowerCreateAccount> GrowerCreateAccounts { get; set; }

    }
}
