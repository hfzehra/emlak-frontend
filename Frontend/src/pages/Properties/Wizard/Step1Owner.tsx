import { useState } from 'react';
import { apiClient } from '../../../services/apiClient';
import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step1Owner = ({ data, onChange }: Props) => {
  const [mode, setMode] = useState<'new' | 'existing'>(data.existingOwnerId ? 'existing' : 'new');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const searchOwners = async (q: string) => {
    setSearch(q);
    if (q.length < 2) return;
    const res = await apiClient.get(`/persons?personType=0&search=${q}`);
    setResults(res.data);
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
            <input value={data.ownerPhone ?? ''} onChange={e => onChange({ ownerPhone: e.target.value })} placeholder="0532..." />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={data.ownerEmail ?? ''} onChange={e => onChange({ ownerEmail: e.target.value })} placeholder="ahmet@..." />
          </div>
          <div className="form-group">
            <label>TC Kimlik No</label>
            <input value={data.ownerIdentityNumber ?? ''} onChange={e => onChange({ ownerIdentityNumber: e.target.value })} placeholder="12345678901" maxLength={11} />
          </div>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label>Sahip Ara</label>
            <input value={search} onChange={e => searchOwners(e.target.value)} placeholder="Ad, telefon ile ara..." />
          </div>
          {results.map((r: any) => (
            <div key={r.id}
              className={`search-result ${data.existingOwnerId === r.id ? 'selected' : ''}`}
              onClick={() => onChange({ existingOwnerId: r.id })}>
              <strong>{r.fullName}</strong> — {r.phone}
            </div>
          ))}
          {data.existingOwnerId && <p className="selected-info">✓ Seçildi</p>}
        </div>
      )}
    </div>
  );
};

