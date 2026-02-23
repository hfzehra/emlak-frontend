﻿namespace Application.Common.Interfaces;

public interface ITenantService
{
    Guid GetCurrentCompanyId();
    void SetCompanyId(Guid companyId);
}

