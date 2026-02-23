import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCompanyRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
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
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => '/companies',
      providesTags: ['Company'],
    }),
    getCompanyById: builder.query<Company, string>({
      query: (id) => `/companies/${id}`,
      providesTags: ['Company'],
    }),
    createCompany: builder.mutation<{ id: string }, CreateCompanyRequest>({
      query: (company) => ({
        url: '/companies',
        method: 'POST',
        body: company,
      }),
      invalidatesTags: ['Company'],
    }),
    updateCompany: builder.mutation<void, UpdateCompanyRequest>({
      query: ({ id, ...company }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: { id, ...company },
      }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;

