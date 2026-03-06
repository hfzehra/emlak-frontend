﻿import { useEffect, useState } from 'react';
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

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
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
  ownerName: string;
  ownerId: string;
  tenantName?: string;
  tenantId?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  deposit?: number;
  createdAt: string;
}

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PropertyDetail>>({});

  useEffect(() => {
    if (!id) return;
    
    apiClient.get<PropertyDetail>(`/properties/${id}`)
      .then(r => {
        setProperty(r.data);
        setEditForm(r.data);
      })
      .catch(err => {
        console.error('Mülk detayı yüklenemedi:', err.response?.data);
        setError(err.response?.data?.detail || 'Mülk bulunamadı.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Bu mülkü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    
    try {
      await apiClient.delete(`/properties/${id}`);
      navigate('/mulkler');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Mülk silinemedi.');
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/properties/${id}`, editForm);
      setProperty({ ...property, ...editForm } as PropertyDetail);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Güncelleme başarısız.');
    }
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-error">
        <p>{error || 'Mülk bulunamadı.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/mulkler')}>
          Mülklere Dön
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <div className="property-detail__header">
        <button className="btn-back" onClick={() => navigate('/mulkler')}>
          <ArrowLeftIcon />
          <span>Geri</span>
        </button>
        
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setIsEditing(!isEditing)}>
            <EditIcon />
            {isEditing ? 'İptal' : 'Düzenle'}
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <TrashIcon />
            Sil
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
              <span className="stat-value stat-value--primary">
                {property.monthlyRent.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="property-stat">
              <span className="stat-label">Mülk Tipi</span>
              <span className="stat-value">{property.propertyType}</span>
            </div>
            {property.roomCount && (
              <div className="property-stat">
                <span className="stat-label">Oda Sayısı</span>
                <span className="stat-value">{property.roomCount}</span>
              </div>
            )}
            {property.area && (
              <div className="property-stat">
                <span className="stat-label">Alan</span>
                <span className="stat-value">{property.area} m²</span>
              </div>
            )}
            <div className="property-stat">
              <span className="stat-label">Kira Vadesi</span>
              <span className="stat-value">Her ayın {property.rentDueDay}. günü</span>
            </div>
          </div>
        </div>

        <div className="property-sections">
          {/* Mülk Sahibi */}
          <div className="info-section">
            <div className="section-title">
              <UserIcon />
              <h3>Mülk Sahibi</h3>
            </div>
            <div className="info-content">
              <p className="info-value">{property.ownerName}</p>
            </div>
          </div>

          {/* Kiracı Bilgisi */}
          {property.isRented && property.tenantName && (
            <div className="info-section">
              <div className="section-title">
                <HomeIcon />
                <h3>Kiracı</h3>
              </div>
              <div className="info-content">
                <p className="info-value">{property.tenantName}</p>
              </div>
            </div>
          )}

          {/* Sözleşme Bilgileri */}
          {property.isRented && property.contractStartDate && (
            <div className="info-section">
              <div className="section-title">
                <CalendarIcon />
                <h3>Sözleşme</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Başlangıç</span>
                  <span className="info-value">
                    {new Date(property.contractStartDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                {property.contractEndDate && (
                  <div className="info-item">
                    <span className="info-label">Bitiş</span>
                    <span className="info-value">
                      {new Date(property.contractEndDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                {property.deposit && (
                  <div className="info-item">
                    <span className="info-label">Depozito</span>
                    <span className="info-value">{property.deposit.toLocaleString('tr-TR')} ₺</span>
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
                  <input
                    type="text"
                    value={editForm.shortAddress || ''}
                    onChange={e => setEditForm({ ...editForm, shortAddress: e.target.value })}
                    placeholder="Sokak, Bina No, vb."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Aylık Kira (₺)</label>
                  <input
                    type="number"
                    value={editForm.monthlyRent || ''}
                    onChange={e => setEditForm({ ...editForm, monthlyRent: +e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div className="form-group">
                  <label>Kira Vadesi (Ayın Kaçı)</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={editForm.rentDueDay || ''}
                    onChange={e => setEditForm({ ...editForm, rentDueDay: +e.target.value })}
                    placeholder="5"
                  />
                </div>
              </div>
              
              <div className="form-hint-box">
                <small>💡 Komisyon otomatik hesaplanır: Kira × %20</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.isRented || false}
                    onChange={e => setEditForm({ ...editForm, isRented: e.target.checked })}
                  />
                  <span>Kirada</span>
                </label>
                <small className="form-hint">Mülk şu anda kirada ise işaretleyin</small>
              </div>

              {editForm.isRented && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Sözleşme Başlangıç</label>
                      <input
                        type="date"
                        value={editForm.contractStartDate?.split('T')[0] || ''}
                        onChange={e => setEditForm({ ...editForm, contractStartDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Sözleşme Bitiş</label>
                      <input
                        type="date"
                        value={editForm.contractEndDate?.split('T')[0] || ''}
                        onChange={e => setEditForm({ ...editForm, contractEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                  İptal
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

