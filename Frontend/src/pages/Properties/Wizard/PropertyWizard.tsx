import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/apiClient';
import { getCities, getDistricts, type City, type District } from '../../../services/turkeyApi';
import { PhoneInput } from '../../../components/PhoneInput';
import './PropertyWizard.css';

// ---- Types ----
export interface WizardData {
  existingOwnerId?: string;
  ownerFirstName?: string; ownerLastName?: string;
  ownerPhone?: string; ownerEmail?: string;
  isRented: boolean;
  existingTenantId?: string;
  tenantFirstName?: string; tenantLastName?: string;
  tenantPhone?: string; tenantEmail?: string;
  contractRentAmount?: number;
  contractStartDate?: string; contractEndDate?: string;
  city: string; district: string; shortAddress: string;
  propertyType: number; roomCount?: number; area?: number;
  monthlyRent: number; rentDueDay: number; commission?: number;
  commissionType: 'percent' | 'fixed';
  commissionRate?: number;
  commissionIncludesVat: boolean;
}

interface StepProps { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

// ---- Step1Owner ----
const Step1Owner = ({ data, onChange }: StepProps) => {
  const [mode, setMode] = useState<'new' | 'existing'>(data.existingOwnerId ? 'existing' : 'new');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ id: string; fullName: string; phone: string }[]>([]);
  const [allOwners, setAllOwners] = useState<{ id: string; fullName: string; phone: string }[]>([]);

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
          <div className="form-group"><label>Ad *</label><input value={data.ownerFirstName ?? ''} onChange={e => onChange({ ownerFirstName: e.target.value })} placeholder="Ahmet" /></div>
          <div className="form-group"><label>Soyad *</label><input value={data.ownerLastName ?? ''} onChange={e => onChange({ ownerLastName: e.target.value })} placeholder="Yılmaz" /></div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.ownerPhone ?? ''} onChange={v => onChange({ ownerPhone: v })} />
          </div>
          <div className="form-group"><label>E-posta</label><input type="email" value={data.ownerEmail ?? ''} onChange={e => onChange({ ownerEmail: e.target.value })} /></div>
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

// ---- Step2Rental ----
const Step2Rental = ({ data, onChange }: StepProps) => (
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
          <div className="form-group"><label>Kiracı Adı *</label><input value={data.tenantFirstName ?? ''} onChange={e => onChange({ tenantFirstName: e.target.value })} /></div>
          <div className="form-group"><label>Kiracı Soyadı *</label><input value={data.tenantLastName ?? ''} onChange={e => onChange({ tenantLastName: e.target.value })} /></div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.tenantPhone ?? ''} onChange={v => onChange({ tenantPhone: v })} />
          </div>
          <div className="form-group"><label>E-posta</label><input type="email" value={data.tenantEmail ?? ''} onChange={e => onChange({ tenantEmail: e.target.value })} /></div>
        </div>
        <h4 style={{ marginTop: '1.5rem' }}>Sözleşme Bilgileri</h4>
        <div className="form-grid">
          <div className="form-group"><label>Başlangıç Tarihi *</label><input type="date" value={data.contractStartDate ?? ''} onChange={e => onChange({ contractStartDate: e.target.value })} /></div>
          <div className="form-group"><label>Bitiş Tarihi *</label><input type="date" value={data.contractEndDate ?? ''} onChange={e => onChange({ contractEndDate: e.target.value })} /></div>
        </div>
      </>
    )}
  </div>
);

// ---- Step3Property ----
const PROPERTY_TYPES = ['Daire', 'Müstakil Ev', 'Villa', 'Ofis', 'Dükkan', 'Depo', 'Arsa', 'Diğer'];

const Step3Property = ({ data, onChange }: StepProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    getCities().then(d => { setCities(d); setLoadingCities(false); });
  }, []);

  const handleCityChange = async (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    onChange({ city: cityName, district: '' });
    setLoadingDistricts(true);
    const districtData = await getDistricts(cityId);
    setDistricts(districtData);
    setLoadingDistricts(false);
  };

  return (
    <div className="step-content">
      <h3>Adım 3: Mülk Bilgisi</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Şehir *</label>
          <select
            value={data.city || ''}
            onChange={(e) => {
              const cityId = parseInt(e.target.options[e.target.selectedIndex].dataset.cityId || '0');
              const cityName = e.target.value;
              if (cityId) handleCityChange(cityId, cityName);
            }}
            disabled={loadingCities}
          >
            <option value="">-- Şehir Seçin --</option>
            {cities.map(city => (
              <option key={city.id} value={city.name} data-city-id={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>İlçe *</label>
          <select value={data.district || ''} onChange={(e) => onChange({ district: e.target.value })} disabled={!selectedCityId || loadingDistricts}>
            <option value="">-- İlçe Seçin --</option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group form-full"><label>Kısa Adres *</label><input value={data.shortAddress ?? ''} onChange={e => onChange({ shortAddress: e.target.value })} placeholder="Moda Cad. No:5 D:3" /></div>
        <div className="form-group"><label>Mülk Tipi</label>
          <select value={data.propertyType ?? 0} onChange={e => onChange({ propertyType: +e.target.value })}>
            {PROPERTY_TYPES.map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Oda Sayısı</label><input type="number" value={data.roomCount ?? ''} onChange={e => onChange({ roomCount: +e.target.value })} placeholder="3" /></div>
        <div className="form-group"><label>Alan (m²)</label><input type="number" value={data.area ?? ''} onChange={e => onChange({ area: +e.target.value })} placeholder="120" /></div>
      </div>
    </div>
  );
};

// ---- Step4Financial ----
const Step4Financial = ({ data, onChange }: StepProps) => {
  const commType = data.commissionType ?? 'percent';
  const commRate = data.commissionRate ?? 0;
  const includeVat = data.commissionIncludesVat ?? false;
  const monthlyRent = data.monthlyRent ?? 0;

  const calcCommission = () => {
    let base = commType === 'percent' ? (monthlyRent * commRate / 100) : commRate;
    return includeVat ? base * 1.20 : base;
  };

  const commission = calcCommission();

  const handleRateChange = (val: number) => {
    onChange({ commissionRate: val });
  };

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
            <input
              type="number"
              value={commRate || ''}
              onChange={e => handleRateChange(+e.target.value)}
              placeholder={commType === 'percent' ? '10' : '5000'}
            />
          </div>
          <div className="form-group">
            <label>Hesaplanan Komisyon</label>
            <input
              type="text"
              readOnly
              value={commRate > 0 ? `${commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ ${commType === 'percent' ? `(${commRate}%)` : `(${(monthlyRent > 0 ? (commRate / monthlyRent * 100) : 0).toFixed(1)}%)` }` : '—'}
              style={{ background: '#f1f5f9', color: '#475569', cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeVat}
            onChange={e => onChange({ commissionIncludesVat: e.target.checked })}
          />
          <span>KDV Dahil (+%20) — komisyona %20 KDV ekle</span>
        </label>
        {commRate > 0 && (
          <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.85rem', color: '#1e40af' }}>
            💰 Kira: <strong>{monthlyRent.toLocaleString('tr-TR')} ₺</strong> + Komisyon: <strong>{commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</strong> = Toplam: <strong>{(monthlyRent + commission).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</strong>
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

// ---- PropertyWizard ----
const STEPS = ['Mülk Sahibi', 'Kiralık Mı?', 'Mülk Bilgisi', 'Finansal'];

const validateStep = (step: number, data: Partial<WizardData>): string | null => {
  if (step === 0) {
    if (!data.existingOwnerId) {
      if (!data.ownerFirstName?.trim()) return 'Mülk sahibinin adı zorunludur.';
      if (!data.ownerLastName?.trim()) return 'Mülk sahibinin soyadı zorunludur.';
      if (!data.ownerPhone?.trim()) return 'Mülk sahibinin telefon numarası zorunludur.';
    }
  }
  if (step === 1 && data.isRented) {
    if (!data.tenantFirstName?.trim()) return 'Kiracı adı zorunludur.';
    if (!data.tenantLastName?.trim()) return 'Kiracı soyadı zorunludur.';
    if (!data.tenantPhone?.trim()) return 'Kiracı telefon numarası zorunludur.';
    if (!data.contractStartDate) return 'Sözleşme başlangıç tarihi zorunludur.';
    if (!data.contractEndDate) return 'Sözleşme bitiş tarihi zorunludur.';
    if (data.contractEndDate && data.contractStartDate && data.contractEndDate <= data.contractStartDate)
      return 'Sözleşme bitiş tarihi başlangıç tarihinden büyük olmalıdır.';
  }
  if (step === 2) {
    if (!data.city?.trim()) return 'Şehir seçimi zorunludur.';
    if (!data.district?.trim()) return 'İlçe seçimi zorunludur.';
    if (!data.shortAddress?.trim()) return 'Kısa adres zorunludur.';
  }
  if (step === 3) {
    if (!data.monthlyRent || data.monthlyRent <= 0) return 'Aylık kira tutarı girilmelidir.';
  }
  return null;
};

export const PropertyWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');
  const [data, setData] = useState<Partial<WizardData>>({
    isRented: false, rentDueDay: 1, propertyType: 0,
    city: '', district: '', shortAddress: '', monthlyRent: 0,
    commissionType: 'percent', commissionRate: 0, commissionIncludesVat: false
  });

  const updateData = (partial: Partial<WizardData>) => setData(prev => ({ ...prev, ...partial }));

  const handleNext = () => {
    const err = validateStep(step, data);
    if (err) { setStepError(err); return; }
    setStepError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep(3, data);
    if (err) { setStepError(err); return; }
    setLoading(true); setError(''); setStepError('');
    try {
      const submitData = {
        ...data,
        contractStartDate: data.contractStartDate ? new Date(data.contractStartDate).toISOString() : undefined,
        contractEndDate: data.contractEndDate ? new Date(data.contractEndDate).toISOString() : undefined,
        commissionType: data.commissionType === 'percent' ? 0 : 1,
      };
      await apiClient.post('/properties/wizard', submitData);
      navigate('/mulkler');
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { title?: string; errors?: Array<{field: string; message: string}>; detail?: string } } };
      const status = err.response?.status;
      const errorData = err.response?.data;
      if (status && status >= 500) { setError('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'); return; }
      if (errorData?.errors) setError(errorData.errors.map(e => `${e.field}: ${e.message}`).join('\n'));
      else if (errorData?.detail) setError(errorData.detail);
      else if (errorData?.title) setError(errorData.title);
      else setError('Mülk kaydedilirken bir hata oluştu.');
    } finally { setLoading(false); }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>Yeni Mülk Ekle</h2>
        <div className="wizard-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`wizard-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <span className="step-number">{i < step ? '✓' : i + 1}</span>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="wizard-body">
        {step === 0 && <Step1Owner data={data} onChange={updateData} />}
        {step === 1 && <Step2Rental data={data} onChange={updateData} />}
        {step === 2 && <Step3Property data={data} onChange={updateData} />}
        {step === 3 && <Step4Financial data={data} onChange={updateData} />}
      </div>
      {stepError && <div className="wizard-error" style={{ background: '#fef2f2', color: '#dc2626' }}>{stepError}</div>}
      {error && <div className="wizard-error">{error}</div>}
      <div className="wizard-footer">
        {step > 0 && <button className="btn-back" onClick={() => { setStep(s => s - 1); setStepError(''); }}>← Geri</button>}
        {step < 3
          ? <button className="btn-next" onClick={handleNext}>İleri →</button>
          : <button className="btn-submit" onClick={handleSubmit} disabled={loading}>{loading ? 'Kaydediliyor...' : '✓ Mülkü Kaydet'}</button>
        }
      </div>
    </div>
  );
};
