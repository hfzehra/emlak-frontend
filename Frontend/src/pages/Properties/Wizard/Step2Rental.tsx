import { PhoneInput } from '../../../components/PhoneInput';
import type { WizardData } from './PropertyWizard';

interface Props { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

export const Step2Rental = ({ data, onChange }: Props) => (
  <div className="step-content">
    <h3>Adım 2: Kiralık Mı?</h3>
    <div className="mode-toggle">
      <button className={!data.isRented ? 'active' : ''} onClick={() => onChange({ isRented: false })}>Hayır - Boş</button>
      <button className={data.isRented ? 'active' : ''} onClick={() => onChange({ isRented: true })}>Evet - Kirada</button>
    </div>

    {data.isRented && (
      <>
        <h4 style={{ marginTop: '1.5rem' }}>Kiracı Bilgileri</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Kiracı Adı *</label>
            <input value={data.tenantFirstName ?? ''} onChange={e => onChange({ tenantFirstName: e.target.value })} placeholder="Mehmet" />
          </div>
          <div className="form-group">
            <label>Kiracı Soyadı *</label>
            <input value={data.tenantLastName ?? ''} onChange={e => onChange({ tenantLastName: e.target.value })} placeholder="Demir" />
          </div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.tenantPhone ?? ''} onChange={v => onChange({ tenantPhone: v })} />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={data.tenantEmail ?? ''} onChange={e => onChange({ tenantEmail: e.target.value })} />
          </div>
        </div>
        <h4 style={{ marginTop: '1.5rem' }}>Sözleşme Bilgileri</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Başlangıç Tarihi *</label>
            <input type="date" value={data.contractStartDate ?? ''} onChange={e => onChange({ contractStartDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Bitiş Tarihi *</label>
            <input type="date" value={data.contractEndDate ?? ''} onChange={e => onChange({ contractEndDate: e.target.value })} />
          </div>
        </div>
      </>
    )}
  </div>
);
