using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Features.Companies.Commands;

public record CreateCompanyCommand : IRequest<Guid>
{
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateCompanyCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        var companyId = Guid.NewGuid();
        
        var company = new Company
        {
            Id = companyId,
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            CreatedAt = DateTime.UtcNow
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync(cancellationToken);

        return company.Id;
    }
}

