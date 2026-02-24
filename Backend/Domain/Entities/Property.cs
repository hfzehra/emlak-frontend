using Domain.Common;

namespace Domain.Entities;

public class Property : BaseEntity
{
    public string PropertyNumber { get; set; } = string.Empty; // Unique Emlak Numarası
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int RoomCount { get; set; }
    public int Area { get; set; } // Metrekare
    public string PropertyType { get; set; } = string.Empty; // Daire, Villa, İşyeri vb.
    public string Status { get; set; } = "Aktif"; // Aktif, Satıldı, Kiralandı
    
    // Zorunlu Alanlar
    public DateTime RentDate { get; set; } // Kira Tarihi (Takvimde görünecek)
    public string TenantName { get; set; } = string.Empty; // Kiracı Adı
    
    // Foreign Keys (CompanyId BaseEntity'den geliyor)
    public Guid? HomeownerId { get; set; }
    
    // Navigation Properties
    public Company Company { get; set; } = null!;
    public Homeowner? Homeowner { get; set; }
}




