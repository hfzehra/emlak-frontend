import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/apiClient';
import { getCities, getDistricts, type City, type District } from '../../../services/turkeyApi';
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
  contractStartDate?: string; contractEndDate?: string; deposit?: number;
  city: string; district: string; shortAddress: string;
  propertyType: number; roomCount?: number; area?: number;
  monthlyRent: number; rentDueDay: number; commission?: number;
}

interface StepProps { data: Partial<WizardData>; onChange: (d: Partial<WizardData>) => void; }

// ---- Step1Owner ----
const Step1Owner = ({ data, onChange }: StepProps) => {
  const [mode, setMode] = useState<'new' | 'existing'>(data.existingOwnerId ? 'existing' : 'new');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ id: string; fullName: string; phone: string }[]>([]);

  const searchOwners = async (q: string) => {
    setSearch(q);
    if (q.length < 2) return;
    try {
      const res = await apiClient.get<{ id: string; fullName: string; phone: string }[]>(`/persons?personType=0&search=${q}`);
      setResults(res.data);
    } catch { setResults([]); }
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
          <div className="form-group"><label>Telefon *</label><input value={data.ownerPhone ?? ''} onChange={e => onChange({ ownerPhone: e.target.value })} placeholder="0532..." /></div>
          <div className="form-group"><label>E-posta</label><input type="email" value={data.ownerEmail ?? ''} onChange={e => onChange({ ownerEmail: e.target.value })} /></div>
        </div>
      ) : (
        <div>
          <div className="form-group"><label>Sahip Ara</label><input value={search} onChange={e => searchOwners(e.target.value)} placeholder="Ad, telefon ile ara..." /></div>
          {results.map(r => (
            <div key={r.id} className={`search-result ${data.existingOwnerId === r.id ? 'selected' : ''}`} onClick={() => onChange({ existingOwnerId: r.id })}>
              <strong>{r.fullName}</strong> — {r.phone}
            </div>
          ))}
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
          <div className="form-group"><label>Telefon *</label><input value={data.tenantPhone ?? ''} onChange={e => onChange({ tenantPhone: e.target.value })} /></div>
          <div className="form-group"><label>E-posta</label><input type="email" value={data.tenantEmail ?? ''} onChange={e => onChange({ tenantEmail: e.target.value })} /></div>
        </div>
        <h4 style={{ marginTop: '1.5rem' }}>Sözleşme Bilgileri</h4>
        <div className="form-grid">
          <div className="form-group"><label>Depozito (₺)</label><input type="number" value={data.deposit ?? ''} onChange={e => onChange({ deposit: +e.target.value })} placeholder="Opsiyonel" /></div>
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

  // İlleri yükle
  useEffect(() => {
    getCities().then(data => {
      setCities(data);
      setLoadingCities(false);
    });
  }, []);

  // Şehir seçildiğinde ilçeleri yükle
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
              <option key={city.id} value={city.name} data-city-id={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>İlçe *</label>
          <select 
            value={data.district || ''} 
            onChange={(e) => onChange({ district: e.target.value })}
            disabled={!selectedCityId || loadingDistricts}
          >
            <option value="">-- İlçe Seçin --</option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
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
const Step4Financial = ({ data, onChange }: StepProps) => (
  <div className="step-content">
    <h3>Adım 4: Finansal Bilgiler</h3>
    <div className="form-grid">
      <div className="form-group"><label>Aylık Kira (₺) *</label><input type="number" value={data.monthlyRent ?? ''} onChange={e => onChange({ monthlyRent: +e.target.value })} placeholder="5000" /></div>
      <div className="form-group"><label>Kira Vadesi (Ayın Kaçı)</label><input type="number" min="1" max="28" value={data.rentDueDay ?? 1} onChange={e => onChange({ rentDueDay: +e.target.value })} /></div>
      <div className="form-group"><label>Komisyon (₺)</label><input type="number" value={data.commission ?? ''} onChange={e => onChange({ commission: +e.target.value })} placeholder="Opsiyonel" /></div>
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

// ---- PropertyWizard ----
const STEPS = ['Mülk Sahibi', 'Kiralık Mı?', 'Mülk Bilgisi', 'Finansal'];

export const PropertyWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<Partial<WizardData>>({ isRented: false, rentDueDay: 1, propertyType: 0, city: '', district: '', shortAddress: '', monthlyRent: 0 });

  const updateData = (partial: Partial<WizardData>) => setData(prev => ({ ...prev, ...partial }));

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      // Tarihleri ISO UTC formatına çevir
      const submitData = {
        ...data,
        contractStartDate: data.contractStartDate ? new Date(data.contractStartDate).toISOString() : undefined,
        contractEndDate: data.contractEndDate ? new Date(data.contractEndDate).toISOString() : undefined,
      };
      console.log('Gönderilen veri:', submitData);
      const response = await apiClient.post('/properties/wizard', submitData);
      console.log('Başarılı:', response.data);
      navigate('/mulkler');
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { title?: string; errors?: Array<{field: string; message: string}>; detail?: string; innerDetail?: string } } };
      console.error('Wizard hatası:', err.response?.data);
      
      const status = err.response?.status;
      const errorData = err.response?.data;
      
      // 500 sunucu hatası için özel mesaj
      if (status && status >= 500) {
        setError('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        return;
      }
      
      // Validation hatalarını göster
      if (errorData?.errors) {
        const validationErrors = errorData.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        setError(`Doğrulama Hatası:\n${validationErrors}`);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else if (errorData?.title) {
        setError(errorData.title);
      } else {
        setError('Mülk kaydedilirken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
      }
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
      {error && <div className="wizard-error">{error}</div>}
      <div className="wizard-footer">
        {step > 0 && <button className="btn-back" onClick={() => setStep(s => s - 1)}>← Geri</button>}
        {step < 3
          ? <button className="btn-next" onClick={() => setStep(s => s + 1)}>İleri →</button>
          : <button className="btn-submit" onClick={handleSubmit} disabled={loading}>{loading ? 'Kaydediliyor...' : '✓ Mülkü Kaydet'}</button>
        }
      </div>
    </div>
  );
};
