using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Homeowners.Commands;

public record UpdateHomeownerCommand : IRequest<bool>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public class UpdateHomeownerCommandHandler : IRequestHandler<UpdateHomeownerCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdateHomeownerCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateHomeownerCommand request, CancellationToken cancellationToken)
    {
        var homeowner = await _context.Homeowners
            .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

        if (homeowner == null)
            return false;

        homeowner.Name = request.Name;
        homeowner.Phone = request.Phone;
        homeowner.Email = request.Email;
        homeowner.Address = request.Address;
        homeowner.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

