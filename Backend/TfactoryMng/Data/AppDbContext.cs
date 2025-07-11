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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RtList>(entity =>
            {
                // Set the primary key
                entity.HasKey(e => e.rId);

                // Configure the rName property
                entity.Property(e => e.rName)
                      .IsRequired()      // Maps to NOT NULL in SQL
                      .HasMaxLength(100); // Maps to nvarchar(100)

                // Create a unique index on the rName column to prevent duplicate route names
                entity.HasIndex(e => e.rName).IsUnique();
            });

            // Configuration for the GrowerLocation entity
            modelBuilder.Entity<GrowerLocation>(entity =>
            {
                // Set the primary key
                entity.HasKey(g => g.gId);

                // Configure the description property
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
                // Set the primary key
                entity.HasKey(y => y.yId);

                // Configure the relationship with RtList
                entity.HasOne(y => y.RtList)          // Each YieldList has one RtList
                      .WithMany()                     // An RtList can have many YieldLists (but we don't need a navigation property on RtList for this)
                      .HasForeignKey(y => y.rId)      // The foreign key is rId
                      .OnDelete(DeleteBehavior.Restrict); // PREVENTS an RtList from being deleted if it has associated YieldList records.
            });
        }
    }
}