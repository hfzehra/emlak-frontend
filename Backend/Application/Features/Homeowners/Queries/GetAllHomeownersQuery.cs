using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Homeowners.Queries;

public record GetAllHomeownersQuery : IRequest<List<HomeownerDto>>;

public class GetAllHomeownersQueryHandler : IRequestHandler<GetAllHomeownersQuery, List<HomeownerDto>>
{
    private readonly IAppDbContext _context;

    public GetAllHomeownersQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<HomeownerDto>> Handle(GetAllHomeownersQuery request, CancellationToken cancellationToken)
    {
        var homeowners = await _context.Homeowners
            .Select(h => new HomeownerDto
            {
                Id = h.Id,
                Name = h.Name,
                Phone = h.Phone,
                Email = h.Email,
                Address = h.Address,
                CompanyId = h.CompanyId,
                CreatedAt = h.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return homeowners;
    }
}

public class HomeownerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public Guid CompanyId { get; set; }
    public DateTime CreatedAt { get; set; }
}

