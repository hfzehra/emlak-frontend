﻿﻿import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
      // JWT token veya CompanyId header'a eklenecek
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Geliştirme aşamasında test için CompanyId header'ı
      const companyId = localStorage.getItem('companyId');
      if (companyId) {
        headers.set('X-Company-Id', companyId);
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

