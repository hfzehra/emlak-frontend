import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiClient } from '../../services/apiClient';
import '../Login/Login.css';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    setError(null);
    
    try {
      // 30 saniye timeout ile istek gönder
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      await apiClient.post('/auth/forgot-password', 
        { email: data.email },
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      setSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      
      // Timeout hatası
      if (err.name === 'CanceledError' || err.code === 'ECONNABORTED') {
        setError('⏱️ İstek zaman aşımına uğradı. Email servisi şu an yanıt vermiyor. Lütfen daha sonra tekrar deneyin veya sistem yöneticisi ile iletişime geçin.');
        return;
      }
      
      const errorData = err.response?.data;
      
      // Backend'den gelen hata mesajını göster
      if (errorData?.detail) {
        setError(`❌ ${errorData.detail}`);
      } else if (errorData?.message) {
        setError(`❌ ${errorData.message}`);
      } else if (err.response?.status === 500) {
        setError('🔧 Sunucu hatası: Email gönderimi şu an çalışmıyor. Lütfen sistem yöneticisine haber verin.');
      } else if (err.response?.status === 0 || !err.response) {
        setError('🌐 Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
      } else {
        setError('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <span>Emlak SaaS</span>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 className="auth-title">Email Gönderildi!</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. 
              Lütfen gelen kutunuzu kontrol edin.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Email gelmedi mi? Spam klasörünü kontrol edin veya birkaç dakika bekleyin.
            </p>
            <Link to="/login" className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>Emlak SaaS</span>
        </div>

        <h1 className="auth-title">Şifremi Unuttum</h1>
        
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>

        {error && (
          <div className="auth-alert" style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label>E-posta Adresi</label>
            <input
              type="email"
              placeholder="ornek@email.com"
              {...register('email', { 
                required: 'E-posta zorunludur',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Geçerli bir e-posta adresi giriniz'
                }
              })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">← Giriş sayfasına dön</Link>
        </p>
      </div>
    </div>
  );
};

