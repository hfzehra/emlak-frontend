﻿using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Features.Properties.Commands;

public record CreatePropertyCommand : IRequest<Guid>
{
    public string Address { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int RoomCount { get; init; }
    public int Area { get; init; }
    public string PropertyType { get; init; } = string.Empty;
    public DateTime RentDate { get; init; }
    public string TenantName { get; init; } = string.Empty;
    public Guid? HomeownerId { get; init; }
}

public class CreatePropertyCommandHandler : IRequestHandler<CreatePropertyCommand, Guid>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public CreatePropertyCommandHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<Guid> Handle(CreatePropertyCommand request, CancellationToken cancellationToken)
    {
        var currentCompanyId = _tenantService.GetCurrentCompanyId();
        
        // Unique Emlak Numarası Oluştur: EMK-{ShortCompanyId}-{RandomNumber}
        var companyShortId = currentCompanyId.ToString().Substring(0, 8).ToUpper();
        var randomPart = new Random().Next(1000, 9999);
        var propertyNumber = $"EMK-{companyShortId}-{randomPart}";
        
        var property = new Property
        {
            PropertyNumber = propertyNumber,
            Address = request.Address,
            Price = request.Price,
            RoomCount = request.RoomCount,
            Area = request.Area,
            PropertyType = request.PropertyType,
            RentDate = request.RentDate,
            TenantName = request.TenantName,
            HomeownerId = request.HomeownerId,
            CompanyId = currentCompanyId
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync(cancellationToken);

        return property.Id;
    }
}

