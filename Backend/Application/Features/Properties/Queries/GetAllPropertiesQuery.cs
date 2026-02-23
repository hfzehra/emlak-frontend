﻿using Application.Common.Interfaces;
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
            .Where(p => p.CompanyId == currentCompanyId && !p.IsDeleted)
            .Select(p => new PropertyDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Address = p.Address,
                Price = p.Price,
                RoomCount = p.RoomCount,
                Area = p.Area,
                PropertyType = p.PropertyType,
                Status = p.Status,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return properties;
    }
}

public class PropertyDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int RoomCount { get; set; }
    public int Area { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

