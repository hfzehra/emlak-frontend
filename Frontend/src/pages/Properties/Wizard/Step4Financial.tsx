import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step4Financial = ({ data, onChange }: Props) => {
  const commType = data.commissionType ?? 'percent';
  const commRate = data.commissionRate ?? 0;
  const includeVat = data.commissionIncludesVat ?? false;
  const monthlyRent = data.monthlyRent ?? 0;

  const commission = (() => {
    const base = commType === 'percent' ? (monthlyRent * commRate / 100) : commRate;
    return includeVat ? base * 1.20 : base;
  })();

  return (
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
      </div>

      <div style={{ marginTop: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 0.8rem' }}>Komisyon Ayarları</h4>
        <div className="mode-toggle" style={{ marginBottom: '0.8rem' }}>
          <button className={commType === 'percent' ? 'active' : ''} onClick={() => onChange({ commissionType: 'percent', commissionRate: 0 })}>% Yüzde</button>
          <button className={commType === 'fixed' ? 'active' : ''} onClick={() => onChange({ commissionType: 'fixed', commissionRate: 0 })}>₺ Sabit Tutar</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>{commType === 'percent' ? 'Komisyon Oranı (%)' : 'Komisyon Tutarı (₺)'}</label>
            <input type="number" value={commRate || ''} onChange={e => onChange({ commissionRate: +e.target.value })} placeholder={commType === 'percent' ? '10' : '5000'} />
          </div>
          <div className="form-group">
            <label>Hesaplanan Komisyon</label>
            <input type="text" readOnly value={commRate > 0 ? `${commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺` : '—'} style={{ background: '#f1f5f9', color: '#475569', cursor: 'not-allowed' }} />
          </div>
        </div>
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeVat} onChange={e => onChange({ commissionIncludesVat: e.target.checked })} />
          <span>KDV Dahil (+%20)</span>
        </label>
        {commRate > 0 && (
          <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.85rem', color: '#1e40af' }}>
            💰 Kira: <strong>{monthlyRent.toLocaleString('tr-TR')} ₺</strong> + Komisyon: <strong>{commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</strong>
          </div>
        )}
      </div>

      <div className="wizard-summary" style={{ marginTop: '1.2rem' }}>
        <h4>📋 Özet</h4>
        <p>📍 {data.district}, {data.city} — {data.shortAddress}</p>
        <p>💰 Aylık Kira: <strong>{(data.monthlyRent ?? 0).toLocaleString('tr-TR')} ₺</strong></p>
        <p>🗓️ Vade: Ayın {data.rentDueDay ?? 1}. günü</p>
        <p>🏠 Durum: <strong>{data.isRented ? 'Kirada' : 'Boş'}</strong></p>
      </div>
    </div>
  );
};
