using Microsoft.EntityFrameworkCore;
using TfactoryMng.Model;

namespace TfactoryMng.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<RtList> RtLists { get; set; }
        public DbSet<YieldList> YieldLists { get; set; }
        public DbSet<TransportCost> TransportCosts { get; set; }
        public DbSet<TransportPerformance> TransportPerformances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure RtList
            modelBuilder.Entity<RtList>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.rName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.rName).IsUnique();
            });

            // Configure YieldList
            modelBuilder.Entity<YieldList>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.HasOne(y => y.RtList)
                    .WithMany(r => r.YieldLists)
                    .HasForeignKey(y => y.rName)
                    .HasPrincipalKey(r => r.rName)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure TransportCost with decimal precision
            modelBuilder.Entity<TransportCost>(entity =>
            {
                entity.HasKey(e => e.id);

                // Specify precision for decimal properties
                entity.Property(e => e.costPerKM)
                    .HasPrecision(18, 2); // 18 digits total, 2 decimal places

                entity.Property(e => e.totalDistanceKM)
                    .HasPrecision(18, 2);

                entity.Property(e => e.totalCost)
                    .HasPrecision(18, 2);

                entity.HasOne(t => t.RtList)
                    .WithMany(r => r.TransportCosts)
                    .HasForeignKey(t => t.rName)
                    .HasPrincipalKey(r => r.rName)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure TransportPerformance
            modelBuilder.Entity<TransportPerformance>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.HasOne(t => t.RtList)
                    .WithMany(r => r.TransportPerformances)
                    .HasForeignKey(t => t.rName)
                    .HasPrincipalKey(r => r.rName)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    
    }
}