import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerAction } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import '../Login/Login.css';

interface RegisterForm {
  companyName: string; companyEmail: string; companyPhone: string;
  firstName: string; lastName: string; email: string; password: string;
}

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const result = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 520 }}>
        <div className="login-header">
          <h1>🏠 Emlak SaaS</h1>
          <p>Yeni şirket kaydı oluşturun</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label>Şirket Adı</label>
            <input placeholder="ABC Emlak" {...register('companyName', { required: 'Zorunlu' })} />
            {errors.companyName && <span className="field-error">{errors.companyName.message}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Şirket E-posta</label>
              <input type="email" placeholder="info@abc.com" {...register('companyEmail', { required: 'Zorunlu' })} />
              {errors.companyEmail && <span className="field-error">{errors.companyEmail.message}</span>}
            </div>
            <div className="form-group">
              <label>Şirket Telefon</label>
              <input placeholder="0212..." {...register('companyPhone')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Ad</label>
              <input placeholder="Ahmet" {...register('firstName', { required: 'Zorunlu' })} />
              {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input placeholder="Yılmaz" {...register('lastName', { required: 'Zorunlu' })} />
              {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Kullanıcı E-posta</label>
            <input type="email" placeholder="ahmet@abc.com" {...register('email', { required: 'Zorunlu' })} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="En az 6 karakter" {...register('password', { required: 'Zorunlu', minLength: { value: 6, message: 'En az 6 karakter' } })} />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Şirket Oluştur'}
          </button>
        </form>
        <p className="login-footer">Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
      </div>
    </div>
  );
};

