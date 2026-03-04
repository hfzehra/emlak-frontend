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
    // Hata zaten authSlice'da state'e yazılıyor, burada bir şey yapmaya gerek yok
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🏠 Emlak SaaS</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              placeholder="ornek@sirket.com"
              {...register('email', { required: 'E-posta zorunludur' })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="••••••"
              {...register('password', { required: 'Şifre zorunludur' })}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="login-footer">
          Hesabınız yok mu? <Link to="/register">Şirket Kaydı</Link>
        </p>
      </div>
    </div>
  );
};

