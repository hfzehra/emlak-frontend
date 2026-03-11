import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import './Profile.css';

// Icons
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

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

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // İsim değiştirme state'leri
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  // Şifre değiştirme state'leri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Şifre görünürlüğü
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<UserProfile>('/auth/profile');
      setUser(response.data);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
    } catch (err: any) {
      setError('Profil bilgileri yüklenemedi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Ad ve soyad boş olamaz.');
      return;
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('Ad ve soyad en az 2 karakter olmalıdır.');
      return;
    }

    try {
      setNameLoading(true);
      await apiClient.put('/auth/update-name', {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      setSuccess('İsim başarıyla güncellendi!');
      fetchProfile(); // Güncel bilgileri çek
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'İsim güncellenirken hata oluştu.');
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasyonlar
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tüm şifre alanlarını doldurun.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('Yeni şifre en az bir büyük harf içermelidir.');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError('Yeni şifre en az bir küçük harf içermelidir.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError('Yeni şifre en az bir rakam içermelidir.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Yeni şifre eski şifre ile aynı olamaz.');
      return;
    }

    try {
      setPasswordLoading(true);
      await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setSuccess('Şifre başarıyla güncellendi!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Şifre güncellenirken hata oluştu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profil Ayarları</h1>
        <p className="page-subtitle">Hesap bilgilerinizi yönetin</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-grid">
        {/* Kullanıcı Bilgileri Kartı */}
        <div className="profile-card">
          <div className="card-header">
            <UserIcon />
            <h2>Kullanıcı Bilgileri</h2>
          </div>
          <div className="card-body">
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Şirket</label>
              <p>{user?.companyName}</p>
            </div>
          </div>
        </div>

        {/* İsim Değiştirme Kartı */}
        <div className="profile-card">
          <div className="card-header">
            <UserIcon />
            <h2>İsim Değiştir</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleNameUpdate}>
              <div className="form-group">
                <label htmlFor="firstName">Ad *</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adınız"
                  disabled={nameLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Soyad *</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                  disabled={nameLoading}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={nameLoading}
              >
                {nameLoading ? 'Güncelleniyor...' : 'İsmi Güncelle'}
              </button>
            </form>
          </div>
        </div>

        {/* Şifre Değiştirme Kartı */}
        <div className="profile-card profile-card--full">
          <div className="card-header">
            <LockIcon />
            <h2>Şifre Değiştir</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentPassword">Mevcut Şifre *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Mevcut şifreniz"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newPassword">Yeni Şifre *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Yeni şifreniz"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <small className="hint">
                    En az 6 karakter, büyük-küçük harf ve rakam içermelidir
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Yeni Şifre (Tekrar) *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Yeni şifreniz (tekrar)"
                      disabled={passwordLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

