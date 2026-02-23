using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Properties.Commands;

public record DeletePropertyCommand(Guid Id) : IRequest<bool>;

public class DeletePropertyCommandHandler : IRequestHandler<DeletePropertyCommand, bool>
{
    private readonly IAppDbContext _context;
    private readonly ITenantService _tenantService;

    public DeletePropertyCommandHandler(IAppDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    public async Task<bool> Handle(DeletePropertyCommand request, CancellationToken cancellationToken)
    {
        var currentCompanyId = _tenantService.GetCurrentCompanyId();
        
        var property = await _context.Properties
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.CompanyId == currentCompanyId, cancellationToken);

        if (property == null)
            return false;

        // Soft delete
        property.IsDeleted = true;
        
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

