import type { WizardData } from './PropertyWizard';

const PROPERTY_TYPES = ['Daire', 'Müstakil Ev', 'Villa', 'Ofis', 'Dükkan', 'Depo', 'Arsa', 'Diğer'];

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step3Property = ({ data, onChange }: Props) => (
  <div className="step-content">
    <h3>Adım 3: Mülk Bilgisi</h3>
    <div className="form-grid">
      <div className="form-group">
        <label>Şehir *</label>
        <input value={data.city ?? ''} onChange={e => onChange({ city: e.target.value })} placeholder="İstanbul" />
      </div>
      <div className="form-group">
        <label>İlçe *</label>
        <input value={data.district ?? ''} onChange={e => onChange({ district: e.target.value })} placeholder="Kadıköy" />
      </div>
      <div className="form-group form-full">
        <label>Kısa Adres *</label>
        <input value={data.shortAddress ?? ''} onChange={e => onChange({ shortAddress: e.target.value })} placeholder="Moda Cad. No:5 D:3" />
      </div>
      <div className="form-group">
        <label>Mülk Tipi</label>
        <select value={data.propertyType ?? 0} onChange={e => onChange({ propertyType: +e.target.value })}>
          {PROPERTY_TYPES.map((t, i) => <option key={i} value={i}>{t}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Oda Sayısı</label>
        <input type="number" value={data.roomCount ?? ''} onChange={e => onChange({ roomCount: +e.target.value })} placeholder="3" />
      </div>
      <div className="form-group">
        <label>Alan (m²)</label>
        <input type="number" value={data.area ?? ''} onChange={e => onChange({ area: +e.target.value })} placeholder="120" />
      </div>
    </div>
  </div>
);

