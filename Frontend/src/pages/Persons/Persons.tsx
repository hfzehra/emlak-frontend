import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

interface Person {
  id: string; fullName: string; phone: string; email?: string;
  identityNumber?: string; personType: string; tenantId: string;
}

export const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | '0' | '1'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', identityNumber: '', personType: 0 });

  const fetch = () => {
    const q = typeFilter === 'all' ? '' : `?personType=${typeFilter}`;
    apiClient.get<Person[]>(`/persons${q}`).then(r => setPersons(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [typeFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post('/persons', form);
    setShowForm(false);
    setForm({ firstName: '', lastName: '', phone: '', email: '', identityNumber: '', personType: 0 });
    fetch();
  };

  const filtered = persons.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Kişiler</h1>
        <button className="btn-add" onClick={() => setShowForm(!showForm)} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'İptal' : '+ Yeni Kişi'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1', fontWeight: 700, fontSize: '1rem' }}>Yeni Kişi Ekle</div>
          {[['firstName', 'Ad *'], ['lastName', 'Soyad *'], ['phone', 'Telefon *'], ['email', 'E-posta'], ['identityNumber', 'TC Kimlik']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l}</label>
              <input value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                style={{ padding: '0.65rem', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.95rem' }} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tip</label>
            <select value={form.personType} onChange={e => setForm(f => ({ ...f, personType: +e.target.value }))}
              style={{ padding: '0.65rem', border: '1.5px solid #e5e7eb', borderRadius: 8 }}>
              <option value={0}>Mülk Sahibi</option>
              <option value={1}>Kiracı</option>
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Kaydet</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input placeholder="İsim veya telefon ile ara..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.65rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 8, minWidth: 200 }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', '0', '1'] as const).map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              style={{ padding: '0.5rem 1.25rem', border: `1.5px solid ${typeFilter === f ? '#3b82f6' : '#e5e7eb'}`, borderRadius: 8, background: typeFilter === f ? '#eff6ff' : 'white', color: typeFilter === f ? '#1d4ed8' : '#6b7280', fontWeight: typeFilter === f ? 700 : 400, cursor: 'pointer' }}>
              {f === 'all' ? 'Tümü' : f === '0' ? 'Sahipler' : 'Kiracılar'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Yükleniyor...</div> : (
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #f3f4f6' }}>
                {['Ad Soyad', 'Telefon', 'E-posta', 'TC Kimlik', 'Tip'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Kişi bulunamadı.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{p.fullName}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>{p.phone}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6b7280' }}>{p.email ?? '-'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6b7280', fontFamily: 'monospace' }}>{p.identityNumber ?? '-'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: p.personType === 'Owner' ? '#eff6ff' : '#f0fdf4', color: p.personType === 'Owner' ? '#1d4ed8' : '#16a34a' }}>
                      {p.personType === 'Owner' ? 'Sahip' : 'Kiracı'}
                    </span>
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

