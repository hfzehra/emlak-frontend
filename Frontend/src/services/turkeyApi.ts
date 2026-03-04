import axios from 'axios';

// Türkiye İl ve İlçe API (https://turkiyeapi.dev)
const turkeyApi = axios.create({
  baseURL: 'https://turkiyeapi.dev/api/v1',
});

export interface District {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  districts: District[];
}

// Tüm illeri getir
export const getCities = async (): Promise<City[]> => {
  try {
    const response = await turkeyApi.get<{ data: City[] }>('/provinces');
    return response.data.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  } catch (error) {
    console.error('Şehirler yüklenirken hata:', error);
    return [];
  }
};

// Belirli bir ilin ilçelerini getir
export const getDistricts = async (cityId: number): Promise<District[]> => {
  try {
    const response = await turkeyApi.get<{ data: City }>(`/provinces/${cityId}`);
    return response.data.data.districts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  } catch (error) {
    console.error('İlçeler yüklenirken hata:', error);
    return [];
  }
};

