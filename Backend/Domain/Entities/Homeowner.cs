using Domain.Common;

namespace Domain.Entities;

public class Homeowner : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    
    // Navigation Properties (CompanyId BaseEntity'den geliyor)
    public Company Company { get; set; } = null!;
    public ICollection<Property> Properties { get; set; } = new List<Property>();
}

