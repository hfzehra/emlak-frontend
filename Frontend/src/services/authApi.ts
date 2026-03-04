import { apiClient } from './apiClient';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
  companyName: string; companyEmail: string; companyPhone: string;
  firstName: string; lastName: string; email: string; password: string;
}
export interface AuthResult {
  token: string; userId: string; tenantId: string;
  email: string; fullName: string; role: string; companyName: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResult>('/auth/login', data).then(r => r.data),
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResult>('/auth/register', data).then(r => r.data),
};

