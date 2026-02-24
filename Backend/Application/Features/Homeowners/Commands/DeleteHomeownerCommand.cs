using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Homeowners.Commands;

public record DeleteHomeownerCommand(Guid Id) : IRequest<bool>;

public class DeleteHomeownerCommandHandler : IRequestHandler<DeleteHomeownerCommand, bool>
{
    private readonly IAppDbContext _context;

    public DeleteHomeownerCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteHomeownerCommand request, CancellationToken cancellationToken)
    {
        var homeowner = await _context.Homeowners
            .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

        if (homeowner == null)
            return false;

        homeowner.IsDeleted = true;
        homeowner.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

