using Microsoft.EntityFrameworkCore;
using TfactoryMng.Model;

namespace TfactoryMng.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<RtList> RtLists { get; set; }
        public DbSet<GrowerLocation> GrowerLocations { get; set; }
        public DbSet<YieldList> YieldLists { get; set; }

        public DbSet<Collector> Collectors { get; set; }
        public DbSet<TripRecord> TripRecords { get; set; }

        public DbSet<Vehicle> Vehicles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RtList>(entity =>
            {
                entity.HasKey(e => e.rId);
                entity.Property(e => e.rName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.rName).IsUnique();

               
                entity.HasOne(r => r.Collector)
                      .WithMany(c => c.Routes)
                      .HasForeignKey(r => r.CollectorId)
                      .OnDelete(DeleteBehavior.SetNull);

            });

           
            modelBuilder.Entity<GrowerLocation>(entity =>
            {
                
                entity.HasKey(g => g.gId);

                entity.Property(g => g.description).HasMaxLength(200);

                // Configure the one-to-many relationship with RtList
                entity.HasOne(g => g.RtList)          // Each GrowerLocation has one RtList
                      .WithMany(r => r.GrowerLocations) // Each RtList can have many GrowerLocations
                      .HasForeignKey(g => g.RtListId)   // The foreign key is RtListId
                      .OnDelete(DeleteBehavior.Cascade); // If an RtList is deleted, all its GrowerLocations are also deleted.
            });

            // Configuration for the YieldList entity
            modelBuilder.Entity<YieldList>(entity =>
            {
                entity.HasKey(y => y.yId);

              
                entity.HasOne(y => y.RtList)          // Each YieldList has one RtList
                      .WithMany()                     // An RtList can have many YieldLists (but we don't need a navigation property on RtList for this)
                      .HasForeignKey(y => y.rId)      // The foreign key is rId
                      .OnDelete(DeleteBehavior.Restrict); // PREVENTS an RtList from being deleted if it has associated YieldList records.
            });

            modelBuilder.Entity<Collector>(entity =>
            {
                entity.HasKey(c => c.CollectorId);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(150);
                entity.HasOne(c => c.Vehicle)
                      .WithOne(v => v.Collector)
                      .HasForeignKey<Vehicle>(v => v.CollectorId);
            });

            // Configuration for TripRecord
            modelBuilder.Entity<TripRecord>(entity =>
            {
                entity.HasKey(t => t.TripId);

                entity.HasOne(t => t.Route)
                      .WithMany(r => r.TripRecords)
                      .HasForeignKey(t => t.RouteId)
                      .OnDelete(DeleteBehavior.Cascade); // If a route is deleted, its trip history is also deleted

                entity.HasOne(t => t.Collector)
                      .WithMany(c => c.TripRecords)
                      .HasForeignKey(t => t.CollectorId)
                      .OnDelete(DeleteBehavior.Cascade); 
            });

            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.HasKey(v => v.VehicleId);
                entity.HasIndex(v => v.LicensePlate).IsUnique();
                entity.Property(v => v.Volume).HasColumnType("decimal(18, 3)"); // 18 total digits, 3 for decimal part

                entity.Property(v => v.CollectorId).IsRequired();
            });
        }
    }
}   