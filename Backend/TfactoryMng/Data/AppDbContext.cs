using Microsoft.EntityFrameworkCore;
using TfactoryMng.Model;

namespace TfactoryMng.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<RtList> RtLists { get; set; }
        public DbSet<GrowerLocation> GrowerLocations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RtList>(entity =>
            {
                entity.HasKey(e => e.rId);
                entity.Property(e => e.rName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.rName).IsUnique();
            });

            modelBuilder.Entity<GrowerLocation>(entity =>
            {
                entity.HasKey(g => g.gId);
                entity.Property(g => g.description).HasMaxLength(200);

                entity.HasOne(g => g.RtList)
                    .WithMany(r => r.GrowerLocations)
                    .HasForeignKey(g => g.RtListId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}