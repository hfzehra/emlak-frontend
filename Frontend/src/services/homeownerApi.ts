import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Homeowner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  companyId: string;
  createdAt: string;
}

export interface CreateHomeownerRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateHomeownerRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export const homeownerApi = createApi({
  reducerPath: 'homeownerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5038/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      const companyId = localStorage.getItem('companyId');
      if (companyId) {
        headers.set('X-Company-Id', companyId);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Homeowner'],
  endpoints: (builder) => ({
    getHomeowners: builder.query<Homeowner[], void>({
      query: () => '/homeowners',
      providesTags: ['Homeowner'],
    }),
    getHomeownerById: builder.query<Homeowner, string>({
      query: (id) => `/homeowners/${id}`,
      providesTags: ['Homeowner'],
    }),
    createHomeowner: builder.mutation<{ id: string }, CreateHomeownerRequest>({
      query: (homeowner) => ({
        url: '/homeowners',
        method: 'POST',
        body: homeowner,
      }),
      invalidatesTags: ['Homeowner'],
    }),
    updateHomeowner: builder.mutation<void, UpdateHomeownerRequest>({
      query: ({ id, ...homeowner }) => ({
        url: `/homeowners/${id}`,
        method: 'PUT',
        body: { id, ...homeowner },
      }),
      invalidatesTags: ['Homeowner'],
    }),
    deleteHomeowner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/homeowners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Homeowner'],
    }),
  }),
});

export const {
  useGetHomeownersQuery,
  useGetHomeownerByIdQuery,
  useCreateHomeownerMutation,
  useUpdateHomeownerMutation,
  useDeleteHomeownerMutation,
} = homeownerApi;

