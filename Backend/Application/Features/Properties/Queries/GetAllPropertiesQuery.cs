﻿﻿﻿using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Properties.Queries;

public record GetAllPropertiesQuery : IRequest<List<PropertyDto>>;

public class GetAllPropertiesQueryHandler : IRequestHandler<GetAllPropertiesQuery, List<PropertyDto>>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public GetAllPropertiesQueryHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<List<PropertyDto>> Handle(GetAllPropertiesQuery request, CancellationToken cancellationToken)
    {
        var currentCompanyId = _tenantService.GetCurrentCompanyId();
        
        var properties = await _context.Properties
            .Include(p => p.Homeowner)
            .Where(p => p.CompanyId == currentCompanyId && !p.IsDeleted)
            .Select(p => new PropertyDto
            {
                Id = p.Id,
                PropertyNumber = p.PropertyNumber,
                Address = p.Address,
                Price = p.Price,
                RoomCount = p.RoomCount,
                Area = p.Area,
                PropertyType = p.PropertyType,
                Status = p.Status,
                RentDate = p.RentDate,
                TenantName = p.TenantName,
                HomeownerId = p.HomeownerId,
                HomeownerName = p.Homeowner != null ? p.Homeowner.Name : "Belirtilmemiş",
                CompanyId = p.CompanyId,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return properties;
    }
}

public class PropertyDto
{
    public Guid Id { get; set; }
    public string PropertyNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int RoomCount { get; set; }
    public int Area { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime RentDate { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public Guid? HomeownerId { get; set; }
    public string HomeownerName { get; set; } = string.Empty;
    public Guid CompanyId { get; set; }
    public DateTime CreatedAt { get; set; }
}

