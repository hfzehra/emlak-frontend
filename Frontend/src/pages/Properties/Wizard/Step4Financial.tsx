import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step4Financial = ({ data, onChange }: Props) => (
  <div className="step-content">
    <h3>Adım 4: Finansal Bilgiler</h3>
    <div className="form-grid">
      <div className="form-group">
        <label>Aylık Kira (₺) *</label>
        <input type="number" value={data.monthlyRent ?? ''} onChange={e => onChange({ monthlyRent: +e.target.value })} placeholder="5000" />
      </div>
      <div className="form-group">
        <label>Kira Vadesi (Ayın Kaçı)</label>
        <input type="number" min="1" max="28" value={data.rentDueDay ?? 1} onChange={e => onChange({ rentDueDay: +e.target.value })} />
      </div>
      <div className="form-group">
        <label>Komisyon (₺)</label>
        <input type="number" value={data.commission ?? ''} onChange={e => onChange({ commission: +e.target.value })} placeholder="Opsiyonel" />
      </div>
    </div>
    <div className="wizard-summary">
      <h4>📋 Özet</h4>
      <p>📍 {data.district}, {data.city} — {data.shortAddress}</p>
      <p>💰 Aylık Kira: <strong>{(data.monthlyRent ?? 0).toLocaleString('tr-TR')} ₺</strong></p>
      <p>🗓️ Vade: Ayın {data.rentDueDay ?? 1}. günü</p>
      <p>🏠 Durum: <strong>{data.isRented ? 'Kirada' : 'Boş'}</strong></p>
    </div>
  </div>
);

