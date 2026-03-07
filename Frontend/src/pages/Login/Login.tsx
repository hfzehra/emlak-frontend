import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { authApi } from '../../services/authApi';
import type { AppDispatch, RootState } from '../../app/store';
import './Login.css';

interface LoginForm {
  email: string;
  password: string;
}

// Göz ikonu - şifre görünür
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Göz kapalı ikonu - şifre gizli
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) navigate('/');
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) { setForgotError('E-posta adresi zorunludur.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) { setForgotError('Geçerli bir e-posta giriniz.'); return; }

    setForgotLoading(true);
    setForgotError('');
    try {
      await authApi.forgotPassword(forgotEmail);
      setForgotSuccess(true);
    } catch {
      setForgotError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setForgotSuccess(false);
    setForgotError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span>Emlak SaaS</span></div>
        <h1 className="auth-title">Giriş Yap</h1>
        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              {...register('email', { required: 'E-posta zorunludur' })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <div className="auth-field-header">
              <label>Şifre</label>
              <button type="button" className="auth-forgot" onClick={() => setShowForgotModal(true)}>
                Şifremi Unuttum?
              </button>
            </div>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Şifre zorunludur' })}
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
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

      {/* Şifremi Unuttum Modalı */}
      {showForgotModal && (
        <div className="auth-modal-overlay" onClick={closeForgotModal}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={closeForgotModal}>✕</button>

            {forgotSuccess ? (
              <div className="auth-modal-success">
                <div className="auth-modal-success-icon">✉️</div>
                <h2>E-posta Gönderildi</h2>
                <p>
                  <strong>{forgotEmail}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
                  Lütfen gelen kutunuzu kontrol edin.
                </p>
                <p className="auth-modal-hint">Bağlantı 1 saat geçerlidir. Spam klasörünü de kontrol etmeyi unutmayın.</p>
                <button className="auth-btn" onClick={closeForgotModal}>Tamam</button>
              </div>
            ) : (
              <>
                <h2>Şifre Sıfırlama</h2>
                <p className="auth-modal-desc">
                  Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
                </p>
                {forgotError && <div className="auth-alert">{forgotError}</div>}
                <div className="auth-field">
                  <label>E-posta Adresi</label>
                  <input
                    type="email"
                    placeholder="ornek@gmail.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                    autoFocus
                  />
                </div>
                <button className="auth-btn" onClick={handleForgotPassword} disabled={forgotLoading}>
                  {forgotLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
