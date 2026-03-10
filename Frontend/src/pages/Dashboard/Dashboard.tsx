﻿import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Dashboard.css';

// SVG Icons
const BuildingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

interface DashboardStats {
  totalProperties: number; rentedProperties: number; vacantProperties: number;
  paidThisMonth: number; unpaidThisMonth: number; totalExpectedThisMonth: number;
  totalCommissionThisMonth: number;
  totalAllTimeCommission: number;
  monthlyCommissions: MonthlyCommission[];
  recentProperties: RecentProperty[];
}

interface MonthlyCommission {
  year: number; month: number; monthName: string; totalCommission: number;
}

interface RecentProperty {
  id: string; propertyNumber: string; shortAddress: string;
  city: string; district: string; isRented: boolean;
  monthlyRent: number; ownerName: string; tenantName?: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get<DashboardStats>('/dashboard')
      .then(r => {
        console.log('Dashboard verisi:', r.data);
        setStats(r.data);
      })
      .catch(err => {
        console.error('Dashboard hatası:', err.response?.data);
        const errorData = err.response?.data;
        let errorMessage = 'Dashboard yüklenemedi.';
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.title) {
          errorMessage = errorData.title;
        }
        // 500 hatası için özel mesaj
        if ((err.response?.status ?? 0) >= 500) {
          errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-loading"><div className="loading-spinner"></div><p>Yükleniyor...</p></div>;
  if (error) return <div className="dashboard-error"><span className="error-icon">!</span><p>{error}</p></div>;

  const statsCards = [
    { 
      key: 'total', 
      icon: <BuildingIcon />, 
      label: 'Toplam Mülk', 
      value: stats?.totalProperties ?? 0, 
      type: 'primary' 
    },
    { 
      key: 'rented', 
      icon: <HomeIcon />, 
      label: 'Kirada', 
      value: stats?.rentedProperties ?? 0, 
      type: 'success' 
    },
    { 
      key: 'vacant', 
      icon: <KeyIcon />, 
      label: 'Boş', 
      value: stats?.vacantProperties ?? 0, 
      type: 'accent' 
    },
    { 
      key: 'commission', 
      icon: <CheckCircleIcon />, 
      label: 'Toplam Geliriniz', 
      value: `${(stats?.totalAllTimeCommission ?? 0).toLocaleString('tr-TR')} ₺`, 
      type: 'warning' 
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Mülk yönetim sisteminize hoş geldiniz</p>
      </div>
      
      <div className="stats-grid">
        {statsCards.map(card => (
          <div key={card.key} className={`stat-card stat-card--${card.type}`}>
            <div className="stat-card__icon">
              {card.icon}
            </div>
            <div className="stat-card__content">
              <span className="stat-card__label">{card.label}</span>
              <span className="stat-card__value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Aylık Gelir Grafiği */}
      {stats?.monthlyCommissions && stats.monthlyCommissions.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="section-header">
            <h2>Son 6 Ayın Geliriniz</h2>
          </div>
          <div className="chart-container">
            {stats.monthlyCommissions.map((m, i) => {
              const maxValue = Math.max(...stats.monthlyCommissions.map(x => x.totalCommission));
              const heightPercent = maxValue > 0 ? (m.totalCommission / maxValue) * 100 : 0;
              
              return (
                <div key={i} className="chart-bar-wrapper">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${heightPercent}%` }}
                      title={`${m.totalCommission.toLocaleString('tr-TR')} ₺`}
                    >
                      <span className="chart-value">{m.totalCommission.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </div>
                  <span className="chart-label">{m.monthName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Son Eklenen Mülkler</h2>
          <button className="btn-view-all" onClick={() => navigate('/mulkler')}>
            Tümünü Gör
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <div className="properties-table-wrapper">
          <table className="properties-table">
            <thead>
              <tr>
                <th>Emlak No</th>
                <th>Adres</th>
                <th>Sahibi</th>
                <th>Kiracı</th>
                <th>Kira</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {!stats?.recentProperties?.length ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state__content">
                      <BuildingIcon />
                      <p>Henüz mülk eklenmemiş</p>
                      <button className="btn btn-primary" onClick={() => navigate('/mulkler/yeni')}>
                        İlk Mülkü Ekle
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentProperties.map(p => (
                  <tr key={p.id} onClick={() => navigate(`/mulkler/${p.id}`)} className="clickable-row">
                    <td><span className="property-number">{p.propertyNumber}</span></td>
                    <td>
                      <div className="address-cell">
                        <span className="address-main">{p.district}, {p.city}</span>
                        <span className="address-detail">{p.shortAddress}</span>
                      </div>
                    </td>
                    <td>{p.ownerName}</td>
                    <td>{p.tenantName || <span className="text-muted">—</span>}</td>
                    <td><span className="rent-amount">{p.monthlyRent.toLocaleString('tr-TR')} ₺</span></td>
                    <td>
                      <span className={`status-badge ${p.isRented ? 'status-badge--rented' : 'status-badge--vacant'}`}>
                        {p.isRented ? 'Kirada' : 'Boş'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
