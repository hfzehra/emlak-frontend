using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Properties.Commands;

public record DeletePropertyCommand(Guid Id) : IRequest<bool>;

public class DeletePropertyCommandHandler : IRequestHandler<DeletePropertyCommand, bool>
{
    private readonly IAppDbContext _context;

    public DeletePropertyCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeletePropertyCommand request, CancellationToken cancellationToken)
    {
        var property = await _context.Properties
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (property == null)
            return false;

        // Soft delete
        property.IsDeleted = true;
        
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

