import { apiClient } from './apiClient';

export interface DemoInfo {
  isDemoMode: boolean;
  isResetEnabled: boolean;
  demoEmail: string;
  demoPassword: string;
  features: {
    autoCleanup: boolean;
    resetOnDemand: boolean;
    sampleData: boolean;
  };
}

export interface DemoStats {
  totalProperties: number;
  totalPersons: number;
  totalContracts: number;
  totalNotifications: number;
  totalRentPayments: number;
  sampleDataCount: {
    properties: number;
    persons: number;
    contracts: number;
  };
}

export interface DemoResetResponse {
  message: string;
  deletedCount: {
    properties: number;
    persons: number;
    contracts: number;
    notifications: number;
    rentPayments: number;
  };
}

export const demoApi = {
  /**
   * Demo bilgilerini getirir
   */
  getInfo: async (): Promise<DemoInfo> => {
    const response = await apiClient.get<DemoInfo>('/demo/info');
    return response.data;
  },

  /**
   * Demo istatistiklerini getirir (giriş gerekli)
   */
  getStats: async (): Promise<DemoStats> => {
    const response = await apiClient.get<DemoStats>('/demo/stats');
    return response.data;
  },

  /**
   * Demo hesabını sıfırlar (sadece kullanıcı verilerini siler, örnek veriler kalır)
   */
  reset: async (): Promise<DemoResetResponse> => {
    const response = await apiClient.post<DemoResetResponse>('/demo/reset');
    return response.data;
  },
};

