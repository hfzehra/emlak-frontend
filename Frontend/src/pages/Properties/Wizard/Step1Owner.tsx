import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';
import { PhoneInput } from '../../../components/PhoneInput';
import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step1Owner = ({ data, onChange }: Props) => {
  const [mode, setMode] = useState<'new' | 'existing'>(data.existingOwnerId ? 'existing' : 'new');
  const [search, setSearch] = useState('');
  const [allOwners, setAllOwners] = useState<{ id: string; fullName: string; phone: string; email?: string }[]>([]);
  const [results, setResults] = useState<{ id: string; fullName: string; phone: string; email?: string }[]>([]);

  useEffect(() => {
    if (mode === 'existing') {
      apiClient.get<{ id: string; fullName: string; phone: string; email?: string }[]>('/persons?personType=0')
        .then(r => { setAllOwners(r.data); setResults(r.data); })
        .catch(() => {});
    }
  }, [mode]);

  const searchOwners = (q: string) => {
    setSearch(q);
    if (!q) { setResults(allOwners); return; }
    setResults(allOwners.filter(o => o.fullName.toLowerCase().includes(q.toLowerCase()) || o.phone.includes(q)));
  };

  const selectedOwner = allOwners.find(o => o.id === data.existingOwnerId);

  return (
    <div className="step-content">
      <h3>Adım 1: Mülk Sahibi {selectedOwner && <span style={{ color: '#16a34a', fontWeight: 600 }}>— {selectedOwner.fullName}</span>}</h3>
      <div className="mode-toggle">
        <button className={mode === 'new' ? 'active' : ''} onClick={() => { setMode('new'); onChange({ existingOwnerId: undefined }); }}>Yeni Sahip</button>
        <button className={mode === 'existing' ? 'active' : ''} onClick={() => setMode('existing')}>Mevcut Seç</button>
      </div>

      {mode === 'new' ? (
        <div className="form-grid">
          <div className="form-group">
            <label>Ad *</label>
            <input value={data.ownerFirstName ?? ''} onChange={e => onChange({ ownerFirstName: e.target.value })} placeholder="Ahmet" />
          </div>
          <div className="form-group">
            <label>Soyad *</label>
            <input value={data.ownerLastName ?? ''} onChange={e => onChange({ ownerLastName: e.target.value })} placeholder="Yılmaz" />
          </div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.ownerPhone ?? ''} onChange={v => onChange({ ownerPhone: v })} />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={data.ownerEmail ?? ''} onChange={e => onChange({ ownerEmail: e.target.value })} placeholder="ahmet@..." />
          </div>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label>Sahip Ara / Seç</label>
            <input value={search} onChange={e => searchOwners(e.target.value)} placeholder="Ad, telefon ile ara..." style={{ marginBottom: '0.5rem' }} />
            <select
              value={data.existingOwnerId ?? ''}
              onChange={e => onChange({ existingOwnerId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem' }}
            >
              <option value="">-- Sahip Seçin --</option>
              {results.map(r => (
                <option key={r.id} value={r.id}>{r.fullName} — {r.phone}</option>
              ))}
            </select>
          </div>
          {selectedOwner && (
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 0.3rem', fontWeight: 700, color: '#166534' }}>✓ Seçilen Sahip:</p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#166534' }}><strong>Ad Soyad:</strong> {selectedOwner.fullName}</p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#166534' }}><strong>Telefon:</strong> {selectedOwner.phone}</p>
              {selectedOwner.email && <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#166534' }}><strong>E-posta:</strong> {selectedOwner.email}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
