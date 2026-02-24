﻿using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Properties.Queries;

public record GetPropertyByIdQuery(Guid Id) : IRequest<PropertyDto?>;

public class GetPropertyByIdQueryHandler : IRequestHandler<GetPropertyByIdQuery, PropertyDto?>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public GetPropertyByIdQueryHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<PropertyDto?> Handle(GetPropertyByIdQuery request, CancellationToken cancellationToken)
    {
        var currentCompanyId = _tenantService.GetCurrentCompanyId();
        
        var property = await _context.Properties
            .Include(p => p.Homeowner)
            .Where(p => p.Id == request.Id && p.CompanyId == currentCompanyId && !p.IsDeleted)
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
                HomeownerName = p.Homeowner != null ? p.Homeowner.Name : string.Empty,
                CompanyId = p.CompanyId,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return property;
    }
}

