using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Features.Properties.Commands;

public record CreatePropertyCommand : IRequest<Guid>
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int RoomCount { get; init; }
    public int Area { get; init; }
    public string PropertyType { get; init; } = string.Empty;
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
        var property = new Property
        {
            Title = request.Title,
            Description = request.Description,
            Address = request.Address,
            Price = request.Price,
            RoomCount = request.RoomCount,
            Area = request.Area,
            PropertyType = request.PropertyType,
            CompanyId = _tenantService.GetCurrentCompanyId()
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync(cancellationToken);

        return property.Id;
    }
}

