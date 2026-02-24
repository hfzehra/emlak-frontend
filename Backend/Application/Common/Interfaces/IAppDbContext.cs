﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Company> Companies { get; set; }
    DbSet<Property> Properties { get; set; }
    DbSet<Homeowner> Homeowners { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

