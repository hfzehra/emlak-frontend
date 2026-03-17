import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/apiClient';
import { getCities, getDistricts, type City, type District } from '../../../services/turkeyApi';
import { PhoneInput } from '../../../components/PhoneInput';
import { GoogleAddressInput } from '../../../components/GoogleAddressInput';
import { MapPinIcon, MoneyIcon, CalendarIcon, ListIcon, CheckIcon } from '../../../components/Icons';
import './PropertyWizard.css';

// ---- Types ----
export interface WizardData {
  existingOwnerId?: string;
  ownerFirstName?: string; ownerLastName?: string;
  ownerPhone?: string; ownerEmail?: string; ownerIdentityNumber?: string;
  isRented: boolean;
  existingTenantId?: string;
  tenantFirstName?: string; tenantLastName?: string;
  tenantPhone?: string; tenantEmail?: string;
  contractRentAmount?: number;
  contractStartDate?: string; contractEndDate?: string; deposit?: number;
  city: string; district: string; shortAddress: string;
  propertyType: number; roomCount?: number; area?: number;
  monthlyRent: number; rentDueDay: number; commission?: number;
  commissionType?: 'percent' | 'fixed';
  commissionRate?: number;
  commissionIncludesVat?: boolean;
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

  const selectedOwner = results.find(r => r.id === data.existingOwnerId);

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
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>En az 2 karakter giriniz</small>
          </div>
          <div className="form-group">
            <label>Soyad *</label>
            <input value={data.ownerLastName ?? ''} onChange={e => onChange({ ownerLastName: e.target.value })} placeholder="Yılmaz" />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>En az 2 karakter giriniz</small>
          </div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.ownerPhone ?? ''} onChange={v => onChange({ ownerPhone: v })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Format: 0(5XX) XXX XX XX - Benzersiz olmalı</small>
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={data.ownerEmail ?? ''} onChange={e => onChange({ ownerEmail: e.target.value })} />
            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>@ karakteri zorunludur (opsiyonel)</small>
          </div>
        </div>
      ) : (
        <div>
          <div className="form-group"><label>Sahip Ara</label><input value={search} onChange={e => searchOwners(e.target.value)} placeholder="Ad, telefon ile ara..." /></div>
          {results.map(r => (
            <div key={r.id} className={`search-result ${data.existingOwnerId === r.id ? 'selected' : ''}`} onClick={() => onChange({ existingOwnerId: r.id })}>
              <strong>{r.fullName}</strong> — {r.phone}
            </div>
          ))}
          {data.existingOwnerId && (
            <p className="selected-info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckIcon size={16} color="#10b981" />
              Sahip Seçildi
            </p>
          )}
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
          <div className="form-group">
            <label>Kiracı Adı *</label>
            <input value={data.tenantFirstName ?? ''} onChange={e => onChange({ tenantFirstName: e.target.value })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>En az 2 karakter giriniz</small>
          </div>
          <div className="form-group">
            <label>Kiracı Soyadı *</label>
            <input value={data.tenantLastName ?? ''} onChange={e => onChange({ tenantLastName: e.target.value })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>En az 2 karakter giriniz</small>
          </div>
          <div className="form-group">
            <label>Telefon *</label>
            <PhoneInput value={data.tenantPhone ?? ''} onChange={v => onChange({ tenantPhone: v })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Format: 0(5XX) XXX XX XX - Benzersiz olmalı</small>
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={data.tenantEmail ?? ''} onChange={e => onChange({ tenantEmail: e.target.value })} />
            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>@ karakteri zorunludur (opsiyonel)</small>
          </div>
        </div>
        <h4 style={{ marginTop: '1.5rem' }}>Sözleşme Bilgileri</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Depozito (₺)</label>
            <input type="number" value={data.deposit ?? ''} onChange={e => onChange({ deposit: +e.target.value })} placeholder="Opsiyonel" />
            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>İsteğe bağlı</small>
          </div>
          <div className="form-group">
            <label>Başlangıç Tarihi *</label>
            <input type="date" value={data.contractStartDate ?? ''} onChange={e => onChange({ contractStartDate: e.target.value })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Zorunlu - Bitiş tarihinden önce olmalı</small>
          </div>
          <div className="form-group">
            <label>Bitiş Tarihi *</label>
            <input type="date" value={data.contractEndDate ?? ''} onChange={e => onChange({ contractEndDate: e.target.value })} />
            <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Zorunlu - En az 1 ay sonra olmalı</small>
          </div>
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
          <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Zorunlu - Bir şehir seçiniz</small>
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
          <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Zorunlu - Önce şehir seçiniz</small>
        </div>
        <div className="form-group form-full">
          <label>Kısa Adres *</label>
          <GoogleAddressInput 
            value={data.shortAddress ?? ''} 
            onChange={(address) => onChange({ shortAddress: address })} 
            placeholder="Adres aramaya başlayın (örn: Moda Caddesi No:5)" 
          />
          <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
            📍 Google Maps ile adres arayın veya manuel girin - En az 10 karakter
          </small>
        </div>
        <div className="form-group">
          <label>Mülk Tipi</label>
          <select value={data.propertyType ?? 0} onChange={e => onChange({ propertyType: +e.target.value })}>
            {PROPERTY_TYPES.map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
          <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Mülkün türünü seçiniz</small>
        </div>
        <div className="form-group">
          <label>Oda Sayısı</label>
          <input type="number" value={data.roomCount ?? ''} onChange={e => onChange({ roomCount: +e.target.value })} placeholder="3" />
          <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>0-20 arası (opsiyonel)</small>
        </div>
        <div className="form-group">
          <label>Alan (m²)</label>
          <input type="number" value={data.area ?? ''} onChange={e => onChange({ area: +e.target.value })} placeholder="120" />
          <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>1-100.000 m² arası (opsiyonel)</small>
        </div>
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

  // Komisyon Hesaplama: Kira + Ek Komisyon + KDV
  const commission = (() => {
    // 1. Başlangıç: Emlakçı her zaman kirayı alır
    let total = monthlyRent;
    
    // 2. Ek komisyon varsa ekle (% veya sabit TL)
    if (commRate > 0) {
      const extraCommission = commType === 'percent' 
        ? (monthlyRent * commRate / 100) 
        : commRate;
      total += extraCommission;
    }
    
    // 3. KDV eklenecekse kiranın %20'sini ekle
    if (includeVat) {
      const vat = monthlyRent * 0.20;
      total += vat;
    }
    
    return total;
  })();

  // Detay gösterimi için ayrı hesaplamalar
  const extraCommission = commRate > 0 
    ? (commType === 'percent' ? (monthlyRent * commRate / 100) : commRate)
    : 0;
  const vatAmount = includeVat ? (monthlyRent * 0.20) : 0;

  return (
    <div className="step-content">
      <h3>Adım 4: Finansal Bilgiler</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Aylık Kira (₺) *</label>
          <input 
            type="number" 
            min="1000" 
            step="100" 
            value={data.monthlyRent && data.monthlyRent > 0 ? data.monthlyRent : ''} 
            onChange={e => {
              const value = e.target.value;
              onChange({ monthlyRent: value ? +value : 0 });
            }}
            onKeyPress={(e) => {
              // Sadece rakam girişine izin ver
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="Minimum 1.000 TL" 
          />
          <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Zorunlu - Minimum 1.000 TL, sadece rakam giriniz</small>
        </div>
        <div className="form-group">
          <label>Kira Vadesi (Ayın Kaçı)</label>
          <input 
            type="number" 
            min="1" 
            max="31" 
            value={data.rentDueDay ?? 1} 
            onChange={e => onChange({ rentDueDay: +e.target.value })} 
            onKeyPress={(e) => {
              // Sadece rakam girişine izin ver
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>1-31 arası bir gün giriniz</small>
        </div>
      </div>

      <div style={{ marginTop: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 0.8rem' }}>Komisyon Ayarları</h4>
        <div className="mode-toggle" style={{ marginBottom: '0.8rem' }}>
          <button className={commType === 'percent' ? 'active' : ''} onClick={() => onChange({ commissionType: 'percent', commissionRate: 0 })}>% Yüzde</button>
          <button className={commType === 'fixed' ? 'active' : ''} onClick={() => onChange({ commissionType: 'fixed', commissionRate: 0 })}>₺ Sabit</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>{commType === 'percent' ? 'Oran (%)' : 'Tutar (₺)'}</label>
            <input 
              type="number" 
              value={commRate && commRate > 0 ? commRate : ''} 
              onChange={e => {
                const value = e.target.value;
                onChange({ commissionRate: value ? +value : 0 });
              }}
              onKeyPress={(e) => {
                // Sadece rakam ve nokta girişine izin ver
                if (!/[0-9.]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder={commType === 'percent' ? '10' : '5000'} 
            />
          </div>
          <div className="form-group">
            <label>Ek Komisyon</label>
            <input type="text" readOnly value={commRate > 0 ? `+${extraCommission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺` : '—'} style={{ background: '#f1f5f9', color: '#475569', cursor: 'not-allowed' }} />
          </div>
        </div>
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={includeVat} onChange={e => onChange({ commissionIncludesVat: e.target.checked })} />
          <span>KDV Dahil (+%20 Kiradan)</span>
        </label>
        <div style={{ marginTop: '0.8rem', padding: '0.8rem 1rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.85rem', color: '#1e40af', borderLeft: '3px solid #3b82f6' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>💰 Toplam Emlakçı Geliri: {commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>
            <div>• Kira: {monthlyRent.toLocaleString('tr-TR')} ₺</div>
            {extraCommission > 0 && <div>• Ek Komisyon: +{extraCommission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</div>}
            {vatAmount > 0 && <div>• KDV (%20): +{vatAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</div>}
          </div>
        </div>
      </div>

      <div className="wizard-summary" style={{ marginTop: '1.2rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListIcon size={18} />
          Özet
        </h4>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPinIcon size={16} />
          {data.district}, {data.city} — {data.shortAddress}
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MoneyIcon size={16} />
          Aylık Kira: <strong>{(data.monthlyRent ?? 0).toLocaleString('tr-TR')} ₺</strong>
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={16} />
          Vade: Ayın {data.rentDueDay ?? 1}. günü
        </p>
        <p>🏠 Durum: <strong>{data.isRented ? 'Kirada' : 'Boş'}</strong></p>
      </div>
    </div>
  );
};

// ---- PropertyWizard ----
const STEPS = ['Mülk Sahibi', 'Kiralık Mı?', 'Mülk Bilgisi', 'Finansal'];

export const PropertyWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<Partial<WizardData>>({ isRented: false, rentDueDay: 1, propertyType: 0, city: '', district: '', shortAddress: '', monthlyRent: 0 });

  const updateData = (partial: Partial<WizardData>) => setData(prev => ({ ...prev, ...partial }));

  // Adım validation fonksiyonu
  const validateStep = (currentStep: number): string | null => {
    switch (currentStep) {
      case 0: // Mülk Sahibi
        if (data.existingOwnerId) {
          return null; // Mevcut sahip seçildi, OK
        }
        if (!data.ownerFirstName?.trim()) return 'Sahip adı gerekli.';
        if (data.ownerFirstName.trim().length < 2) return 'Sahip adı en az 2 karakter olmalı.';
        if (!data.ownerLastName?.trim()) return 'Sahip soyadı gerekli.';
        if (data.ownerLastName.trim().length < 2) return 'Sahip soyadı en az 2 karakter olmalı.';
        if (!data.ownerPhone?.trim()) return 'Sahip telefonu gerekli.';
        
        // Telefon validasyonu - Tam 10 hane, başında 0 yok
        const ownerCleanPhone = data.ownerPhone.replace(/\D/g, '');
        if (ownerCleanPhone.length !== 10) {
          return 'Telefon numarası başında 0 olmadan tam olarak 10 haneli olmalı. Örnek: 5321234567';
        }
        if (!ownerCleanPhone.startsWith('5')) {
          return 'Telefon numarası 5 ile başlamalıdır.';
        }
        
        // Email validasyonu (opsiyonel ama @ zorunlu)
        if (data.ownerEmail && !data.ownerEmail.includes('@')) {
          return 'E-posta adresi @ karakteri içermelidir.';
        }
        return null;

      case 1: // Kiralık mı?
        if (data.isRented) {
          if (!data.existingTenantId) {
            if (!data.tenantFirstName?.trim()) return 'Kiracı adı gerekli.';
            if (data.tenantFirstName.trim().length < 2) return 'Kiracı adı en az 2 karakter olmalı.';
            if (!data.tenantLastName?.trim()) return 'Kiracı soyadı gerekli.';
            if (data.tenantLastName.trim().length < 2) return 'Kiracı soyadı en az 2 karakter olmalı.';
            if (!data.tenantPhone?.trim()) return 'Kiracı telefonu gerekli.';
            
            // Telefon validasyonu - Tam 11 hane, 0 ile başlar
            const tenantCleanPhone = data.tenantPhone.replace(/\D/g, '');
            if (tenantCleanPhone.length !== 11) {
              return 'Telefon numarası tam olarak 11 haneli olmalı. Format: 0(5XX) XXX XX XX';
            }
            if (!tenantCleanPhone.startsWith('0')) {
              return 'Telefon numarası 0 ile başlamalıdır.';
            }
            if (tenantCleanPhone[1] !== '5') {
              return 'Telefon numarası 05 ile başlamalıdır (mobil telefon).';
            }
            
            // Email validasyonu (opsiyonel ama @ zorunlu)
            if (data.tenantEmail && !data.tenantEmail.includes('@')) {
              return 'E-posta adresi @ karakteri içermelidir.';
            }
          }
          
          if (!data.contractStartDate) return 'Sözleşme başlangıç tarihi gerekli.';
          if (!data.contractEndDate) return 'Sözleşme bitiş tarihi gerekli.';
          
          // Tarih mantık kontrolü
          const startDate = new Date(data.contractStartDate);
          const endDate = new Date(data.contractEndDate);
          
          if (startDate >= endDate) {
            return 'Sözleşme bitiş tarihi başlangıç tarihinden sonra olmalı.';
          }
          
          // Minimum 1 ay kontrolü
          const diffTime = endDate.getTime() - startDate.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          if (diffDays < 30) {
            return 'Sözleşme süresi en az 1 ay olmalı.';
          }
        }
        return null;

      case 2: // Mülk Bilgisi
        if (!data.city?.trim()) return 'Şehir seçimi gerekli.';
        if (!data.district?.trim()) return 'İlçe seçimi gerekli.';
        if (!data.shortAddress?.trim()) return 'Kısa adres gerekli.';
        if (data.shortAddress.trim().length < 10) return 'Adres en az 10 karakter olmalı.';
        
        // Oda sayısı ve alan kontrolü
        if (data.roomCount && (data.roomCount < 0 || data.roomCount > 20)) {
          return 'Oda sayısı 0-20 arasında olmalı.';
        }
        if (data.area && (data.area < 1 || data.area > 100000)) {
          return 'Alan 1-100.000 m² arasında olmalı.';
        }
        return null;

      case 3: // Finansal
        if (!data.monthlyRent || data.monthlyRent < 1000) {
          return 'Aylık kira tutarı en az 1.000 TL olmalıdır.';
        }
        if (data.monthlyRent > 10000000) return 'Kira tutarı 10.000.000 TL\'den fazla olamaz.';
        
        // Kira vade günü kontrolü - 1 ile 31 arası
        if (data.rentDueDay && (data.rentDueDay < 1 || data.rentDueDay > 31)) {
          return 'Kira vade günü 1 ile 31 arasında olmalıdır.';
        }
        
        // Komisyon kontrolü
        if (data.commissionRate && data.commissionRate > 0) {
          if (data.commissionType === 'percent' && data.commissionRate > 100) {
            return 'Komisyon yüzdesi 100\'den fazla olamaz.';
          }
          if (data.commissionType === 'fixed' && data.commissionRate > 10000000) {
            return 'Komisyon tutarı 10.000.000 TL\'den fazla olamaz.';
          }
        }
        return null;

      default:
        return null;
    }
  };

  const handleNext = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }

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
      const err = e as { response?: { status?: number; data?: { title?: string; errors?: Record<string, string[]>; detail?: string; innerDetail?: string; message?: string } } };
      console.error('Wizard hatası:', err.response?.data);
      
      const status = err.response?.status;
      const errorData = err.response?.data;
      
      // Özel validation hataları (bizim custom exception'larımız)
      if (errorData?.message) {
        setError(errorData.message);
        return;
      }
      
      // Detail mesajı varsa (ValidationException'dan gelir)
      if (errorData?.detail) {
        setError(errorData.detail);
        return;
      }
      
      // 500 sunucu hatası için özel mesaj
      if (status && status >= 500) {
        if (errorData?.innerDetail?.includes('overlapping') || errorData?.detail?.includes('tarihleri arasında')) {
          setError('⚠️ Bu mülk seçilen tarihler arasında zaten kiralanmış. Lütfen farklı bir mülk seçin veya tarih aralığını değiştirin.');
        } else {
          setError('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        }
        return;
      }
      
      // Validation hatalarını göster (ASP.NET Core format: { "FieldName": ["error1", "error2"] })
      if (errorData?.errors && typeof errorData.errors === 'object') {
        const validationErrors = Object.entries(errorData.errors)
          .map(([, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `• ${msgArray.join(', ')}`;
          })
          .join('\n');
        setError(`Doğrulama Hatası:\n${validationErrors}`);
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
        {step > 0 && <button className="btn-back" onClick={() => { setError(''); setStep(s => s - 1); }}>← Geri</button>}
        {step < 3
          ? <button className="btn-next" onClick={handleNext}>İleri →</button>
          : <button className="btn-submit" onClick={handleSubmit} disabled={loading}>{loading ? 'Kaydediliyor...' : '✓ Mülkü Kaydet'}</button>
        }
      </div>
    </div>
  );
};
