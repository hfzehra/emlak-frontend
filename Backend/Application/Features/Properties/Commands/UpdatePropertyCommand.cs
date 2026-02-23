using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Properties.Commands;

public record UpdatePropertyCommand : IRequest<bool>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int RoomCount { get; init; }
    public int Area { get; init; }
    public string PropertyType { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}

public class UpdatePropertyCommandHandler : IRequestHandler<UpdatePropertyCommand, bool>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public UpdatePropertyCommandHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<bool> Handle(UpdatePropertyCommand request, CancellationToken cancellationToken)
    {
        var currentCompanyId = _tenantService.GetCurrentCompanyId();
        
        var property = await _context.Properties
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.CompanyId == currentCompanyId, cancellationToken);

        if (property == null)
            return false;

        property.Title = request.Title;
        property.Description = request.Description;
        property.Address = request.Address;
        property.Price = request.Price;
        property.RoomCount = request.RoomCount;
        property.Area = request.Area;
        property.PropertyType = request.PropertyType;
        property.Status = request.Status;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

