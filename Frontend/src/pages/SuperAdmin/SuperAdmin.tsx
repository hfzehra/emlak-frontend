import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

interface CompanyStats {
  id: string; name: string; email: string; phone: string;
  isActive: boolean; createdAt: string; lastLoginAt?: string;
  totalProperties: number; rentedProperties: number; totalUsers: number;
}

export const SuperAdmin = () => {
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<CompanyStats[]>('/super-admin/companies')
      .then(r => setCompanies(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalProps = companies.reduce((s, c) => s + c.totalProperties, 0);
  const activeCompanies = companies.filter(c => c.isActive).length;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>🛡️ SuperAdmin Paneli</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Toplam Şirket', value: companies.length, bg: '#eff6ff', color: '#1d4ed8' },
          { label: 'Aktif Şirket', value: activeCompanies, bg: '#f0fdf4', color: '#16a34a' },
          { label: 'Toplam Mülk', value: totalProps, bg: '#fdf4ff', color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '1.25rem', border: `1px solid ${s.bg}` }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Yükleniyor...</div> : (
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #f3f4f6' }}>
                {['Şirket', 'E-posta', 'Durum', 'Son Giriş', 'Mülkler', 'Kullanıcılar', 'Üyelik'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{c.phone}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>{c.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: c.isActive ? '#dcfce7' : '#fee2e2', color: c.isActive ? '#16a34a' : '#dc2626' }}>
                      {c.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontWeight: 700 }}>{c.totalProperties}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}> ({c.rentedProperties} kirada)</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600 }}>{c.totalUsers}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#9ca3af', fontSize: '0.8rem' }}>
                    {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

