import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Property {
  id: string;
  propertyNumber: string;
  address: string;
  price: number;
  roomCount: number;
  area: number;
  propertyType: string;
  status: string;
  rentDate: string;
  tenantName: string;
  homeownerName: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  address: string;
  price: number;
  roomCount: number;
  area: number;
  propertyType: string;
  rentDate: string;
  tenantName: string;
  homeownerId?: string;
}

export interface UpdatePropertyRequest {
  id: string;
  address: string;
  price: number;
  roomCount: number;
  area: number;
  propertyType: string;
  status: string;
  rentDate: string;
  tenantName: string;
  homeownerId?: string;
}

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5038/api',
    prepareHeaders: (headers) => {
      // JWT token header'a ekle
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // TenantId header'ı (backend'te fallback olarak kullanılıyor)
      const tenantId = localStorage.getItem('tenantId');
      if (tenantId) {
        headers.set('X-Company-Id', tenantId);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    getProperties: builder.query<Property[], void>({
      query: () => '/properties',
      providesTags: ['Property'],
    }),
    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: ['Property'],
    }),
    createProperty: builder.mutation<{ id: string }, CreatePropertyRequest>({
      query: (property) => ({
        url: '/properties',
        method: 'POST',
        body: property,
      }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation<void, UpdatePropertyRequest>({
      query: ({ id, ...property }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: { id, ...property },
      }),
      invalidatesTags: ['Property'],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;

