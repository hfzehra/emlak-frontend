using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Features.Homeowners.Commands;

public record CreateHomeownerCommand : IRequest<Guid>
{
    public string Name { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public class CreateHomeownerCommandHandler : IRequestHandler<CreateHomeownerCommand, Guid>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public CreateHomeownerCommandHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<Guid> Handle(CreateHomeownerCommand request, CancellationToken cancellationToken)
    {
        var homeowner = new Homeowner
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            Address = request.Address,
            CompanyId = _tenantService.GetCurrentCompanyId(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Homeowners.Add(homeowner);
        await _context.SaveChangesAsync(cancellationToken);

        return homeowner.Id;
    }
}

