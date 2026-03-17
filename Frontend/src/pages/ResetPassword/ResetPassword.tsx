import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../../services/authApi';
import { CheckCircleIcon } from '../../components/Icons';
import '../Login/Login.css';

interface ResetForm {
  password: string;
  confirmPassword: string;
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const password = watch('password');

  // Geçersiz link kontrolü
  if (!token || !email) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo"><span>Emlak SaaS</span></div>
          <h1 className="auth-title">Geçersiz Bağlantı</h1>
          <div className="auth-alert">Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.</div>
          <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    setServerError('');
    try {
      await authApi.resetPassword(email, token, data.password);
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setServerError(msg ?? 'Bir hata oluştu. Bağlantınız geçersiz veya süresi dolmuş olabilir.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo"><span>Emlak SaaS</span></div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <CheckCircleIcon size={64} color="#10b981" />
            </div>
            <h1 className="auth-title">Şifre Güncellendi!</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <button className="auth-btn" onClick={() => navigate('/login')}>
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span>Emlak SaaS</span></div>
        <h1 className="auth-title">Yeni Şifre Belirle</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{email}</strong> hesabı için yeni şifrenizi girin.
        </p>

        {serverError && <div className="auth-alert">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label>Yeni Şifre</label>
            <div className="auth-input-wrapper">
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
              <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
            <span className="auth-hint">En az 6 karakter, büyük/küçük harf ve rakam içermelidir</span>
          </div>

          <div className="auth-field">
            <label>Şifre Onayı</label>
            <div className="auth-input-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Şifrenizi tekrar girin"
                {...register('confirmPassword', {
                  required: 'Şifre onayı zorunludur',
                  validate: (val) => val === password || 'Şifreler eşleşmiyor'
                })}
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">← Giriş sayfasına dön</Link>
        </p>
      </div>
    </div>
  );
};

