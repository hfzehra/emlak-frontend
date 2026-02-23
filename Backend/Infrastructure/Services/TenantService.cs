using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private Guid? _companyId;

    public TenantService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetCurrentCompanyId()
    {
        // Eğer daha önce set edilmişse, onu kullan
        if (_companyId.HasValue)
        {
            return _companyId.Value;
        }

        // JWT token'dan CompanyId claim'ini al
        var companyIdClaim = _httpContextAccessor.HttpContext?.User
            .FindFirst("CompanyId")?.Value;

        if (companyIdClaim != null && Guid.TryParse(companyIdClaim, out var companyId))
        {
            return companyId;
        }

        // Header'dan CompanyId'yi al (geliştirme aşaması için)
        var companyIdHeader = _httpContextAccessor.HttpContext?.Request.Headers["X-Company-Id"].FirstOrDefault();
        
        if (companyIdHeader != null && Guid.TryParse(companyIdHeader, out var companyIdFromHeader))
        {
            return companyIdFromHeader;
        }

        // Varsayılan olarak empty guid dön (geliştirme için)
        // Production'da burada exception fırlatılmalı
        return Guid.Empty;
    }

    // Test veya seed data için CompanyId manuel set etme
    public void SetCompanyId(Guid companyId)
    {
        _companyId = companyId;
    }
}

