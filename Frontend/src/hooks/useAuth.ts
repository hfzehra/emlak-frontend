import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export const useAuth = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  return {
    user,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'SuperAdmin',
    isCompanyAdmin: user?.role === 'CompanyAdmin',
    tenantId: user?.tenantId,
  };
};

