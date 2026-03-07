import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import './Login.css';

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      navigate('/');
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

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              {...register('email', { required: 'E-posta zorunludur' })}
            />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field-header">
              <label>Şifre</label>
              <button type="button" className="auth-forgot">Şifremi Unuttum?</button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Şifre zorunludur' })}
            />
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

