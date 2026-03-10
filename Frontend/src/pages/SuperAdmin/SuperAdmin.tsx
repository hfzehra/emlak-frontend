import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

interface CompanyStats {
  id: string; name: string; email: string; phone: string;
  isActive: boolean; createdAt: string; lastLoginAt?: string;
  totalProperties: number; rentedProperties: number; totalUsers: number;
}

interface PropertySummary {
  id: string; propertyNumber: string; city: string; district: string;
  shortAddress: string; propertyType: string; isRented: boolean;
  monthlyRent: number; ownerName: string; tenantName?: string; createdAt: string;
}

interface UserSummary {
  id: string; fullName: string; email: string; role: string;
  lastLoginAt?: string; createdAt: string;
}

interface CompanyDetails {
  id: string; name: string; email: string; phone: string;
  isActive: boolean; createdAt: string; lastLoginAt?: string;
  properties: PropertySummary[]; users: UserSummary[];
}

export const SuperAdmin = () => {
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    apiClient.get<CompanyStats[]>('/super-admin/companies')
      .then(r => setCompanies(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadCompanyDetails = async (companyId: string) => {
    setDetailLoading(true);
    try {
      const r = await apiClient.get<CompanyDetails>(`/super-admin/companies/${companyId}`);
      setSelectedCompany(r.data);
    } catch (err) {
      console.error('Şirket detayı yüklenemedi:', err);
    } finally {
      setDetailLoading(false);
    }
  };

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
                <tr 
                  key={c.id} 
                  onClick={() => loadCompanyDetails(c.id)}
                  style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
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

      {/* Şirket Detay Modal */}
      {selectedCompany && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedCompany(null)}>
          <div style={{ background: 'white', borderRadius: 16, maxWidth: 1200, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{selectedCompany.name}</h2>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{selectedCompany.email} • {selectedCompany.phone}</p>
              </div>
              <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>

            {detailLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Yükleniyor...</div>
            ) : (
              <div style={{ padding: '1.5rem' }}>
                {/* Mülkler */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🏠 Mülkler ({selectedCompany.properties.length})
                  </h3>
                  {selectedCompany.properties.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Henüz mülk eklenmemiş.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {selectedCompany.properties.map(p => (
                        <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ fontWeight: 700, color: '#6366f1', fontSize: '0.8rem', background: '#ede9fe', padding: '0.15rem 0.5rem', borderRadius: 4 }}>{p.propertyNumber}</span>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.district}, {p.city}</span>
                              <span style={{ padding: '0.15rem 0.5rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, background: p.isRented ? '#dcfce7' : '#f3f4f6', color: p.isRented ? '#16a34a' : '#6b7280' }}>
                                {p.isRented ? 'Kirada' : 'Boş'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{p.shortAddress}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                              Sahip: {p.ownerName} {p.tenantName && ` • Kiracı: ${p.tenantName}`}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{p.monthlyRent.toLocaleString('tr-TR')} ₺</div>
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{new Date(p.createdAt).toLocaleDateString('tr-TR')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kullanıcılar */}
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    👥 Kullanıcılar ({selectedCompany.users.length})
                  </h3>
                  {selectedCompany.users.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Henüz kullanıcı eklenmemiş.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {selectedCompany.users.map(u => (
                        <div key={u.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: '0.15rem' }}>{u.fullName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{u.email}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: '#ede9fe', padding: '0.15rem 0.5rem', borderRadius: 4, marginBottom: '0.25rem' }}>{u.role}</div>
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                              {u.lastLoginAt ? `Son giriş: ${new Date(u.lastLoginAt).toLocaleDateString('tr-TR')}` : 'Hiç giriş yapmamış'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

