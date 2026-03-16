import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login, clearError } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import './Login.css';

// Icons
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Error'u local state'e kopyala ve auto-clear
  useEffect(() => {
    if (error) {
      setLocalError(error);
      // 10 saniye sonra error'u temizle
      const timer = setTimeout(() => {
        setLocalError(null);
        dispatch(clearError());
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginForm) => {
    // Önceki hatayı temizle
    setLocalError(null);
    dispatch(clearError());
    
    try {
      const result = await dispatch(login(data));
      
      // Başarılı giriş kontrolü
      if (login.fulfilled.match(result)) {
        navigate('/');
      } else if (login.rejected.match(result)) {
        // Hata durumunda hiçbir şey yapma, error Redux'tan gelecek
        console.log('Login rejected:', result.payload);
      }
    } catch (err) {
      console.error('Login submit error:', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span>Emlak SaaS</span>
        </div>

        <h1 className="auth-title">Giriş Yap</h1>

        {localError && <div className="auth-alert">{localError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              {...register('email', { 
                required: 'E-posta zorunludur',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'E-posta adresi @ karakteri içermelidir'
                }
              })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field-header">
              <label>Şifre</label>
              <Link to="/sifremi-unuttum" className="auth-forgot">Şifremi Unuttum?</Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Şifre zorunludur' })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-footer">
          Hesabınız yok mu? <Link to="/register">Ücretsiz Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

