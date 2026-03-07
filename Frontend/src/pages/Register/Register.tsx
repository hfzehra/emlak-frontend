import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerAction } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import '../Login/Login.css';

interface RegisterForm {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    const payload = {
      companyName: data.companyName,
      companyEmail: data.email,
      companyPhone: '',
      firstName: data.companyName,
      lastName: '',
      email: data.email,
      password: data.password,
    };
    const result = await dispatch(registerAction(payload));
    if (registerAction.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>Emlak SaaS</span>
        </div>

        <h1 className="auth-title">Hesap Oluştur</h1>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label>Şirket Adı</label>
            <input
              placeholder="ABC Emlak"
              {...register('companyName', { required: 'Şirket adı zorunludur' })}
            />
            {errors.companyName && <span className="auth-field-error">{errors.companyName.message}</span>}
          </div>

          <div className="auth-field">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="info@abcemlak.com"
              {...register('email', {
                required: 'E-posta zorunludur',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Geçerli bir e-posta giriniz' }
              })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label>Şifre</label>
            <input
              type="password"
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
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
            <span className="auth-hint">En az 6 karakter, büyük/küçük harf ve rakam içermelidir</span>
          </div>

          <div className="auth-field">
            <label>Şifre Onayı</label>
            <input
              type="password"
              placeholder="Şifrenizi tekrar girin"
              {...register('confirmPassword', {
                required: 'Şifre onayı zorunludur',
                validate: (val) => val === password || 'Şifreler eşleşmiyor'
              })}
            />
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <p className="auth-footer">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};
