import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { register as registerAction, clearError } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import '../Login/Login.css';

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

interface RegisterForm {
  companyName: string; companyEmail: string; companyPhone: string;
  firstName: string; lastName: string; email: string; password: string;
}

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Error'u local state'e kopyala ve auto-clear
  useEffect(() => {
    if (error) {
      setLocalError(error);
      // 5 saniye sonra error'u temizle
      const timer = setTimeout(() => {
        setLocalError(null);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterForm) => {
    setLocalError(null); // Önceki hatayı temizle
    const result = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        {/* Logo */}
        <div className="auth-logo">
          <span>Emlak SaaS</span>
        </div>

        <h1 className="auth-title">Şirket Kaydı</h1>

        {localError && <div className="auth-alert">{localError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Company info section */}
          <p className="auth-section-label">Şirket Bilgileri</p>

          <div className="auth-field">
            <label>Şirket Adı</label>
            <input
              placeholder="ABC Emlak"
              {...register('companyName', { required: 'Zorunlu' })}
            />
            {errors.companyName && <span className="auth-field-error">{errors.companyName.message}</span>}
          </div>

          <div className="auth-form-grid">
            <div className="auth-field">
              <label>Şirket E-posta</label>
              <input
                type="email"
                placeholder="info@abc.com"
                {...register('companyEmail', { required: 'Zorunlu' })}
              />
              {errors.companyEmail && <span className="auth-field-error">{errors.companyEmail.message}</span>}
            </div>
            <div className="auth-field">
              <label>Şirket Telefon</label>
              <input placeholder="0212 000 00 00" {...register('companyPhone')} />
            </div>
          </div>

          {/* Admin user section */}
          <p className="auth-section-label">Yönetici Bilgileri</p>

          <div className="auth-form-grid">
            <div className="auth-field">
              <label>Ad</label>
              <input
                placeholder="Ahmet"
                {...register('firstName', { required: 'Zorunlu' })}
              />
              {errors.firstName && <span className="auth-field-error">{errors.firstName.message}</span>}
            </div>
            <div className="auth-field">
              <label>Soyad</label>
              <input
                placeholder="Yılmaz"
                {...register('lastName', { required: 'Zorunlu' })}
              />
              {errors.lastName && <span className="auth-field-error">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="auth-field">
            <label>Kullanıcı E-posta</label>
            <input
              type="email"
              placeholder="ahmet@abc.com"
              {...register('email', { required: 'Zorunlu' })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label>Şifre</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="En az 6 karakter"
                {...register('password', {
                  required: 'Şifre zorunludur',
                  minLength: { value: 6, message: 'En az 6 karakter olmalıdır' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: 'Büyük harf, küçük harf ve rakam içermelidir'
                  }
                })}
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
            <span className="auth-hint">Büyük harf, küçük harf ve rakam içermelidir</span>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Şirket Oluştur'}
          </button>
        </form>

        <p className="auth-footer">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

