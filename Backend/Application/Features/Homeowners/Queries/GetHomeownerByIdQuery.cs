using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Homeowners.Queries;

public record GetHomeownerByIdQuery(Guid Id) : IRequest<HomeownerDto?>;

public class GetHomeownerByIdQueryHandler : IRequestHandler<GetHomeownerByIdQuery, HomeownerDto?>
{
    private readonly IAppDbContext _context;

    public GetHomeownerByIdQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<HomeownerDto?> Handle(GetHomeownerByIdQuery request, CancellationToken cancellationToken)
    {
        var homeowner = await _context.Homeowners
            .Where(h => h.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);

        return homeowner;
    }
}

