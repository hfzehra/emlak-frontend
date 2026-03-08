import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';
import { PhoneInput } from '../../../components/PhoneInput';
import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step1Owner = ({ data, onChange }: Props) => {
  const [mode, setMode] = useState<'new' | 'existing'>(data.existingOwnerId ? 'existing' : 'new');
  const [search, setSearch] = useState('');
  const [allOwners, setAllOwners] = useState<{ id: string; fullName: string; phone: string }[]>([]);
  const [results, setResults] = useState<{ id: string; fullName: string; phone: string }[]>([]);

  useEffect(() => {
    if (mode === 'existing') {
      apiClient.get<{ id: string; fullName: string; phone: string }[]>('/persons?personType=0')
        .then(r => { setAllOwners(r.data); setResults(r.data); })
        .catch(() => {});
    }
  }, [mode]);

  const searchOwners = (q: string) => {
    setSearch(q);
    if (!q) { setResults(allOwners); return; }
    setResults(allOwners.filter(o => o.fullName.toLowerCase().includes(q.toLowerCase()) || o.phone.includes(q)));
  };

  return (
    <div className="step-content">
      <h3>Adım 1: Mülk Sahibi</h3>
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
            <input value={search} onChange={e => searchOwners(e.target.value)} placeholder="Ada göre filtrele..." style={{ marginBottom: '0.5rem' }} />
            <select
              value={data.existingOwnerId ?? ''}
              onChange={e => onChange({ existingOwnerId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}
            >
              <option value="">-- Sahip Seçin --</option>
              {results.map(r => (
                <option key={r.id} value={r.id}>{r.fullName} — {r.phone}</option>
              ))}
            </select>
          </div>
          {data.existingOwnerId && <p className="selected-info">✓ Sahip Seçildi</p>}
        </div>
      )}
    </div>
  );
};
