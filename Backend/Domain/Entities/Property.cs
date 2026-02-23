using Domain.Common;

namespace Domain.Entities;

public class Property : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int RoomCount { get; set; }
    public int Area { get; set; } // Metrekare
    public string PropertyType { get; set; } = string.Empty; // Daire, Villa, İşyeri vb.
    public string Status { get; set; } = "Aktif"; // Aktif, Satıldı, Kiralandı
    
    // Navigation Properties
    public Company Company { get; set; } = null!;
}

