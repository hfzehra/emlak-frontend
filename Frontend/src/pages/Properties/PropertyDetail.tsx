import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './PropertyDetail.css';

// Icons
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const ArchiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

interface PropertyDetail {
  id: string;
  propertyNumber: string;
  city: string;
  district: string;
  shortAddress: string;
  propertyType: string;
  roomCount?: number;
  area?: number;
  isRented: boolean;
  monthlyRent: number;
  rentDueDay: number;
  commission?: number;
  commissionType?: string;
  commissionRate?: number;
  commissionIncludesVat?: boolean;
  ownerName: string;
  ownerId: string;
  tenantName?: string;
  tenantId?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
}

interface EditForm {
  shortAddress: string;
  monthlyRent: number;
  rentDueDay: number;
  isRented: boolean;
  contractStartDate?: string;
  contractEndDate?: string;
  commissionType: 'percent' | 'fixed';
  commissionRate: number;
  commissionIncludesVat: boolean;
}

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    shortAddress: '', monthlyRent: 0, rentDueDay: 1, isRented: false,
    commissionType: 'percent', commissionRate: 0, commissionIncludesVat: false
  });

  useEffect(() => {
    if (!id) return;
    apiClient.get<PropertyDetail>(`/properties/${id}`)
      .then(r => {
        setProperty(r.data);
        setEditForm({
          shortAddress: r.data.shortAddress,
          monthlyRent: r.data.monthlyRent,
          rentDueDay: r.data.rentDueDay,
          isRented: r.data.isRented,
          contractStartDate: r.data.contractStartDate?.split('T')[0],
          contractEndDate: r.data.contractEndDate?.split('T')[0],
          commissionType: r.data.commissionType === 'Fixed' ? 'fixed' : 'percent',
          commissionRate: r.data.commissionRate ?? 0,
          commissionIncludesVat: r.data.commissionIncludesVat ?? false,
        });
      })
      .catch(err => setError(err.response?.data?.detail || 'Mülk bulunamadı.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleArchive = async () => {
    if (!confirm('Bu mülkü arşivlemek istediğinize emin misiniz?')) return;
    try {
      await apiClient.delete(`/properties/${id}`);
      navigate('/mulkler');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Mülk arşivlenemedi.');
    }
  };

  const calcCommission = () => {
    const base = editForm.commissionType === 'percent'
      ? (editForm.monthlyRent * editForm.commissionRate / 100)
      : editForm.commissionRate;
    const vat = editForm.commissionIncludesVat ? (editForm.monthlyRent * 0.20) : 0;
    return base + vat;
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        monthlyRent: editForm.monthlyRent,
        rentDueDay: editForm.rentDueDay,
        shortAddress: editForm.shortAddress,
        isRented: editForm.isRented,
        contractStartDate: editForm.contractStartDate ? new Date(editForm.contractStartDate).toISOString() : undefined,
        contractEndDate: editForm.contractEndDate ? new Date(editForm.contractEndDate).toISOString() : undefined,
        commissionType: editForm.commissionType === 'percent' ? 0 : 1,
        commissionRate: editForm.commissionRate,
        commissionIncludesVat: editForm.commissionIncludesVat,
      };
      await apiClient.put(`/properties/${id}`, payload);
      // Sayfayı yeniden yükle
      const r = await apiClient.get<PropertyDetail>(`/properties/${id}`);
      setProperty(r.data);
      setIsEditing(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string; title?: string } } };
      setError(e.response?.data?.detail || e.response?.data?.title || 'Güncelleme başarısız.');
    }
  };

  if (loading) return <div className="property-detail-loading"><div className="loading-spinner"></div><p>Yükleniyor...</p></div>;
  if (error || !property) return (
    <div className="property-detail-error">
      <p>{error || 'Mülk bulunamadı.'}</p>
      <button className="btn btn-primary" onClick={() => navigate('/mulkler')}>Mülklere Dön</button>
    </div>
  );

  const commissionDisplay = calcCommission();

  return (
    <div className="property-detail">
      <div className="property-detail__header">
        <button className="btn-back" onClick={() => navigate('/mulkler')}>
          <ArrowLeftIcon /><span>Geri</span>
        </button>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setIsEditing(!isEditing)}>
            <EditIcon />{isEditing ? 'İptal' : 'Düzenle'}
          </button>
          <button className="btn btn-danger" onClick={handleArchive} title="Arşivle">
            <ArchiveIcon />Arşivle
          </button>
        </div>
      </div>

      <div className="property-detail__content">
        <div className="property-info-card">
          <div className="property-info-header">
            <div className="property-number-badge">{property.propertyNumber}</div>
            <span className={`status-badge ${property.isRented ? 'status-badge--rented' : 'status-badge--vacant'}`}>
              {property.isRented ? 'Kirada' : 'Boş'}
            </span>
          </div>
          <h1 className="property-title">{property.district}, {property.city}</h1>
          <p className="property-address">{property.shortAddress}</p>
          <div className="property-stats">
            <div className="property-stat">
              <span className="stat-label">Aylık Kira</span>
              <span className="stat-value stat-value--primary">{property.monthlyRent.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div className="property-stat">
              <span className="stat-label">Komisyon</span>
              <span className="stat-value">{property.commission ? `${property.commission.toLocaleString('tr-TR')} ₺` : '—'}</span>
            </div>
            <div className="property-stat">
              <span className="stat-label">Mülk Tipi</span>
              <span className="stat-value">{property.propertyType}</span>
            </div>
            {property.roomCount && <div className="property-stat"><span className="stat-label">Oda Sayısı</span><span className="stat-value">{property.roomCount}</span></div>}
            {property.area && <div className="property-stat"><span className="stat-label">Alan</span><span className="stat-value">{property.area} m²</span></div>}
            <div className="property-stat">
              <span className="stat-label">Kira Vadesi</span>
              <span className="stat-value">Her ayın {property.rentDueDay}. günü</span>
            </div>
          </div>
        </div>

        <div className="property-sections">
          <div className="info-section">
            <div className="section-title"><UserIcon /><h3>Mülk Sahibi</h3></div>
            <div className="info-content"><p className="info-value">{property.ownerName}</p></div>
          </div>

          {property.isRented && property.tenantName && (
            <div className="info-section">
              <div className="section-title"><HomeIcon /><h3>Kiracı</h3></div>
              <div className="info-content"><p className="info-value">{property.tenantName}</p></div>
            </div>
          )}

          {property.isRented && property.contractStartDate && (
            <div className="info-section">
              <div className="section-title"><CalendarIcon /><h3>Sözleşme</h3></div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Başlangıç</span>
                  <span className="info-value">{new Date(property.contractStartDate).toLocaleDateString('tr-TR')}</span>
                </div>
                {property.contractEndDate && (
                  <div className="info-item">
                    <span className="info-label">Bitiş</span>
                    <span className="info-value">{new Date(property.contractEndDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <h2>Mülk Düzenle</h2>
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Kısa Adres</label>
                  <input type="text" value={editForm.shortAddress} onChange={e => setEditForm({ ...editForm, shortAddress: e.target.value })} placeholder="Sokak, Bina No, vb." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Aylık Kira (₺)</label>
                  <input type="number" value={editForm.monthlyRent || ''} onChange={e => setEditForm({ ...editForm, monthlyRent: +e.target.value })} placeholder="5000" />
                </div>
                <div className="form-group">
                  <label>Kira Vadesi (Ayın Kaçı)</label>
                  <input type="number" min="1" max="28" value={editForm.rentDueDay || ''} onChange={e => setEditForm({ ...editForm, rentDueDay: +e.target.value })} />
                </div>
              </div>

              {/* Komisyon */}
              <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Komisyon Ayarları</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button type="button" style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1.5px solid', borderColor: editForm.commissionType === 'percent' ? '#6366f1' : '#e2e8f0', background: editForm.commissionType === 'percent' ? '#ede9fe' : '#fff', cursor: 'pointer', fontWeight: editForm.commissionType === 'percent' ? 700 : 400 }} onClick={() => setEditForm({ ...editForm, commissionType: 'percent' })}>% Yüzde</button>
                  <button type="button" style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1.5px solid', borderColor: editForm.commissionType === 'fixed' ? '#6366f1' : '#e2e8f0', background: editForm.commissionType === 'fixed' ? '#ede9fe' : '#fff', cursor: 'pointer', fontWeight: editForm.commissionType === 'fixed' ? 700 : 400 }} onClick={() => setEditForm({ ...editForm, commissionType: 'fixed' })}>₺ Sabit</button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{editForm.commissionType === 'percent' ? 'Oran (%)' : 'Tutar (₺)'}</label>
                    <input type="number" value={editForm.commissionRate || ''} onChange={e => setEditForm({ ...editForm, commissionRate: +e.target.value })} placeholder={editForm.commissionType === 'percent' ? '10' : '5000'} />
                  </div>
                  <div className="form-group">
                    <label>Hesaplanan</label>
                    <input type="text" readOnly value={editForm.commissionRate > 0 ? `${commissionDisplay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺` : '—'} style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={editForm.commissionIncludesVat} onChange={e => setEditForm({ ...editForm, commissionIncludesVat: e.target.checked })} />
                  <span>KDV Dahil (+%20)</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={editForm.isRented} onChange={e => setEditForm({ ...editForm, isRented: e.target.checked })} />
                  <span>Kirada</span>
                </label>
                <small className="form-hint">Mülk şu anda kirada ise işaretleyin</small>
              </div>

              {editForm.isRented && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Sözleşme Başlangıç</label>
                    <input type="date" value={editForm.contractStartDate || ''} onChange={e => setEditForm({ ...editForm, contractStartDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Sözleşme Bitiş</label>
                    <input type="date" value={editForm.contractEndDate || ''} onChange={e => setEditForm({ ...editForm, contractEndDate: e.target.value })} />
                  </div>
                </div>
              )}

              {error && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}

              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setIsEditing(false)}>İptal</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

