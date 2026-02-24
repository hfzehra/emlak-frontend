﻿﻿import { configureStore } from '@reduxjs/toolkit';
import { propertyApi } from '../services/propertyApi';
import { companyApi } from '../services/companyApi';
import { homeownerApi } from '../services/homeownerApi';

export const store = configureStore({
  reducer: {
    [propertyApi.reducerPath]: propertyApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [homeownerApi.reducerPath]: homeownerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(propertyApi.middleware)
      .concat(companyApi.middleware)
      .concat(homeownerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

