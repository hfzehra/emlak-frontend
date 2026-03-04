import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
import type { LoginRequest, RegisterRequest, AuthResult } from '../../services/authApi';

interface AuthState {
  user: AuthResult | null;
  loading: boolean;
  error: string | null;
}

const stored = localStorage.getItem('user');
const initialState: AuthState = {
  user: stored ? JSON.parse(stored) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (data: LoginRequest, { rejectWithValue }) => {
  try {
    const result = await authApi.login(data);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result));
    // TenantId'yi de sakla (API isteklerinde kullanılabilir)
    if (result.tenantId) {
      localStorage.setItem('tenantId', result.tenantId);
    }
    console.log('Login başarılı:', result);
    return result;
  } catch (err: any) {
    const data = err.response?.data;
    console.error('Login hatası:', data);
    if (data?.errors && Array.isArray(data.errors)) {
      const msgs = data.errors.map((e: any) => e.message).join(', ');
      return rejectWithValue(msgs);
    }
    return rejectWithValue(data?.title ?? data?.detail ?? 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
  }
});

export const register = createAsyncThunk('auth/register', async (data: RegisterRequest, { rejectWithValue }) => {
  try {
    const result = await authApi.register(data);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result));
    // TenantId'yi de sakla
    if (result.tenantId) {
      localStorage.setItem('tenantId', result.tenantId);
    }
    console.log('Kayıt başarılı:', result);
    return result;
  } catch (err: any) {
    const resData = err.response?.data;
    console.error('Kayıt hatası:', resData);
    if (resData?.errors && Array.isArray(resData.errors)) {
      const msgs = resData.errors.map((e: any) => e.message).join(', ');
      return rejectWithValue(msgs);
    }
    return rejectWithValue(resData?.title ?? resData?.detail ?? 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tenantId');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a: PayloadAction<AuthResult>) => { s.loading = false; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a: PayloadAction<AuthResult>) => { s.loading = false; s.user = a.payload; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

