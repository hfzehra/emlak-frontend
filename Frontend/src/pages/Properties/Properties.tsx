﻿import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Properties.css';

// Icons
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ArchiveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

interface Property {
  id: string; propertyNumber: string; city: string; district: string;
  shortAddress: string; propertyType: string; roomCount?: number; area?: number;
  isRented: boolean; monthlyRent: number; ownerName: string;
  tenantName?: string; contractStartDate?: string; contractEndDate?: string; createdAt: string;
}

export const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'rented' | 'vacant'>('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');

  const fetchProperties = () => {
    setError('');
    const params = filter === 'all' ? '' : `?isRented=${filter === 'rented'}`;
    apiClient.get<Property[]>(`/properties${params}`)
      .then(r => setProperties(r.data))
      .catch(err => {
        console.error('Mülkler yüklenemedi:', err.response?.data);
        setError(err.response?.data?.detail || err.response?.data?.title || 'Mülkler yüklenemedi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProperties(); }, [filter]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Bu mülkü arşivlemek istediğinize emin misiniz?')) return;
    try {
      await apiClient.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err: any) {
      console.error('Mülk silme hatası:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.title || 'Mülk silinemedi.');
    }
  };

  const filtered = properties.filter(p => {
    // Arama filtresi
    const searchMatch = p.shortAddress?.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyNumber?.toLowerCase().includes(search.toLowerCase());
    
    if (!searchMatch) return false;

    // Tarih filtresi (sözleşme başlangıç tarihine göre - sadece kirada olan mülkler için)
    if (dateFrom || dateTo) {
      // Eğer mülk kirada değilse veya sözleşme tarihi yoksa filtreden geçir
      if (!p.isRented || !p.contractStartDate) {
        return false;
      }

      // Backend'den gelen tarih: "2026-03-10T10:36:57.855143"
      const contractDate = new Date(p.contractStartDate);
      const contractDay = new Date(contractDate.getFullYear(), contractDate.getMonth(), contractDate.getDate());
      
      if (dateFrom) {
        const fromParts = dateFrom.split('-'); // "2026-01-01" -> ["2026", "01", "01"]
        const fromDay = new Date(parseInt(fromParts[0]), parseInt(fromParts[1]) - 1, parseInt(fromParts[2]));
        if (contractDay < fromDay) {
          return false;
        }
      }
      
      if (dateTo) {
        const toParts = dateTo.split('-'); // "2026-01-31" -> ["2026", "01", "31"]
        const toDay = new Date(parseInt(toParts[0]), parseInt(toParts[1]) - 1, parseInt(toParts[2]));
        if (contractDay > toDay) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="properties-page">
      <div className="page-header">
        <div>
          <h1>Mülkler</h1>
          <p className="page-subtitle">Tüm mülklerinizi yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/mulkler/yeni')}>
          <PlusIcon />
          Yeni Mülk
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Adres, sahip veya emlak no ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>Sözleşme Tarihi:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem' }}
              title="Sözleşme başlangıç tarihi (başlangıç)"
            />
            <span style={{ color: '#94a3b8' }}>—</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem' }}
              title="Sözleşme başlangıç tarihi (bitiş)"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); }}
                style={{ padding: '0.45rem 0.7rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' }}
                title="Tarihleri Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="filter-tabs">
          {(['all', 'rented', 'vacant'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tümü' : f === 'rented' ? 'Kirada' : 'Boş'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-card">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <path d="M9 22v-4h6v4"/>
            <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
          </svg>
          <h3>Mülk bulunamadı</h3>
          <p>İlk mülkünüzü ekleyerek başlayın</p>
          <button className="btn btn-primary" onClick={() => navigate('/mulkler/yeni')}>
            <PlusIcon />
            Yeni Mülk Ekle
          </button>
        </div>
      ) : (
        <div className="properties-grid">
          {filtered.map(p => (
            <div 
              key={p.id} 
              className="property-card"
              onClick={() => navigate(`/mulkler/${p.id}`)}
            >
              <div className="property-card__header">
                <span className="property-number">{p.propertyNumber}</span>
                <span className={`status-badge ${p.isRented ? 'status-badge--rented' : 'status-badge--vacant'}`}>
                  {p.isRented ? 'Kirada' : 'Boş'}
                </span>
              </div>
              <div className="property-card__body">
                <h3 className="property-location">{p.district}, {p.city}</h3>
                <p className="property-address">{p.shortAddress}</p>
                <div className="property-meta">
                  <span>{p.propertyType}</span>
                  {p.roomCount && <span>{p.roomCount} Oda</span>}
                  {p.area && <span>{p.area} m²</span>}
                </div>
                <div className="property-people">
                  <div className="person-info">
                    <span className="person-label">Sahibi</span>
                    <span className="person-name">{p.ownerName}</span>
                  </div>
                  {p.tenantName && (
                    <div className="person-info">
                      <span className="person-label">Kiracı</span>
                      <span className="person-name">{p.tenantName}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="property-card__footer">
                <span className="property-rent">{p.monthlyRent.toLocaleString('tr-TR')} ₺/ay</span>
                <button 
                  className="icon-btn icon-btn--danger" 
                  onClick={(e) => handleDelete(e, p.id)}
                  title="Arşivle"
                >
                  <ArchiveIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
