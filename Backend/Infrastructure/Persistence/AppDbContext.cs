using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    private readonly ITenantService _tenantService;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantService tenantService) 
        : base(options)
    {
        _tenantService = tenantService;
    }

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<Property> Properties { get; set; } = null!;
    public DbSet<Homeowner> Homeowners { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Company Configuration
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasMany(e => e.Properties)
                  .WithOne(e => e.Company)
                  .HasForeignKey(e => e.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.Homeowners)
                  .WithOne(e => e.Company)
                  .HasForeignKey(e => e.CompanyId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            // Company is the tenant itself, only filter by IsDeleted
            entity.HasQueryFilter(c => !c.IsDeleted);
        });

        // Homeowner Configuration
        modelBuilder.Entity<Homeowner>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasMany(e => e.Properties)
                  .WithOne(e => e.Homeowner)
                  .HasForeignKey(e => e.HomeownerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Property Configuration
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PropertyNumber).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.PropertyNumber).IsUnique();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TenantName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.RentDate).IsRequired();
            entity.Property(e => e.HomeownerId).IsRequired(false);
            
            // Multi-tenancy Query Filter
            entity.HasQueryFilter(p => p.CompanyId == _tenantService.GetCurrentCompanyId() && !p.IsDeleted);
        });

        // Global Query Filter for all BaseEntity derived entities (except already configured ones)
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType) && 
                entityType.ClrType != typeof(Property) && // Property için zaten filter ekledik
                entityType.ClrType != typeof(Company)) // Company için zaten filter ekledik
            {
                var method = typeof(AppDbContext)
                    .GetMethod(nameof(SetGlobalQueryFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)?
                    .MakeGenericMethod(entityType.ClrType);
                
                method?.Invoke(null, new object[] { modelBuilder, _tenantService });
            }
        }
    }

    private static void SetGlobalQueryFilter<TEntity>(ModelBuilder modelBuilder, ITenantService tenantService) 
        where TEntity : BaseEntity
    {
        modelBuilder.Entity<TEntity>().HasQueryFilter(e => 
            e.CompanyId == tenantService.GetCurrentCompanyId() && !e.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Handle BaseEntity types (Properties, etc.)
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        // Handle Company separately since it doesn't inherit BaseEntity
        foreach (var entry in ChangeTracker.Entries<Company>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}

