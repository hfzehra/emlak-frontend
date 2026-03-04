import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Dashboard.css';

interface DashboardStats {
  totalProperties: number; rentedProperties: number; vacantProperties: number;
  paidThisMonth: number; unpaidThisMonth: number; totalExpectedThisMonth: number;
  recentProperties: RecentProperty[];
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
        setError(err.response?.data?.title || err.response?.data?.detail || 'Dashboard yüklenemedi');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page">Yükleniyor...</div>;
  if (error) return <div className="error-page" style={{padding: '2rem', textAlign: 'center', color: '#dc2626'}}>❌ {error}</div>;

  return (
    <div className="dashboard">
      <h1 className="page-title">Anasayfa</h1>
      <div className="stats-row">
        <div className="stat-card blue"><div className="stat-icon">🏢</div><div className="stat-content"><h3>Toplam Mülk</h3><p className="stat-number">{stats?.totalProperties ?? 0}</p></div></div>
        <div className="stat-card purple"><div className="stat-icon">🏠</div><div className="stat-content"><h3>Kirada</h3><p className="stat-number">{stats?.rentedProperties ?? 0}</p></div></div>
        <div className="stat-card gray"><div className="stat-icon">🔑</div><div className="stat-content"><h3>Boş</h3><p className="stat-number">{stats?.vacantProperties ?? 0}</p></div></div>
        <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-content"><h3>Tahsil (Bu Ay)</h3><p className="stat-number">{(stats?.paidThisMonth ?? 0).toLocaleString('tr-TR')} ₺</p></div></div>
        <div className="stat-card orange"><div className="stat-icon">⏳</div><div className="stat-content"><h3>Bekleyen (Bu Ay)</h3><p className="stat-number">{(stats?.unpaidThisMonth ?? 0).toLocaleString('tr-TR')} ₺</p></div></div>
      </div>
      <div className="dashboard-card">
        <div className="card-header">
          <h2>📋 Son Eklenen Mülkler</h2>
          <button className="view-all-btn" onClick={() => navigate('/mulkler')}>Tümünü Gör →</button>
        </div>
        <div className="properties-table">
          <table>
            <thead><tr><th>Emlak No</th><th>Adres</th><th>Sahibi</th><th>Kiracı</th><th>Kira</th><th>Durum</th></tr></thead>
            <tbody>
              {!stats?.recentProperties?.length
                ? <tr><td colSpan={6} className="no-data">Henüz mülk yok.</td></tr>
                : stats.recentProperties.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.propertyNumber}</strong></td>
                    <td>{p.district}, {p.city}<br /><small>{p.shortAddress}</small></td>
                    <td>{p.ownerName}</td>
                    <td>{p.tenantName ?? '-'}</td>
                    <td>{p.monthlyRent.toLocaleString('tr-TR')} ₺</td>
                    <td><span className={`status-badge ${p.isRented ? 'kirada' : 'bos'}`}>{p.isRented ? 'Kirada' : 'Boş'}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
