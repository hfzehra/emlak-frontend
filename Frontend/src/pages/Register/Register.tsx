import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerAction } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import '../Login/Login.css';

interface RegisterForm {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    // Şirket e-postası olarak kullanıcı e-postasını kullan
    const submitData = {
      companyName: data.companyName,
      companyEmail: data.email,
      companyPhone: '',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password
    };
    const result = await dispatch(registerAction(submitData));
    if (registerAction.fulfilled.match(result)) navigate('/');
  };

  const password = watch('password');

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        {/* Logo */}
        <div className="auth-logo">
          <span>Emlak SaaS</span>
        </div>

        <h1 className="auth-title">Şirket Kaydı</h1>

        {error && <div className="auth-alert">{error}</div>}

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
            <label>E-posta</label>
            <input
              type="email"
              placeholder="ahmet@abc.com"
              {...register('email', { required: 'Zorunlu' })}
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
            <span className="auth-hint">Büyük harf, küçük harf ve rakam içermelidir</span>
          </div>

          <div className="auth-field">
            <label>Şifre Onayı</label>
            <input
              type="password"
              placeholder="Şifreyi tekrar girin"
              {...register('confirmPassword', {
                required: 'Şifre onayı zorunludur',
                validate: (value) => value === password || 'Şifreler eşleşmiyor'
              })}
            />
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
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
