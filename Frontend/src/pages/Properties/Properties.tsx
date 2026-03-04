import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Properties.css';

interface Property {
  id: string; propertyNumber: string; city: string; district: string;
  shortAddress: string; propertyType: string; roomCount?: number; area?: number;
  isRented: boolean; monthlyRent: number; ownerName: string;
  tenantName?: string; contractEndDate?: string; createdAt: string;
}

export const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'rented' | 'vacant'>('all');
  const [search, setSearch] = useState('');

  const fetchProperties = () => {
    const params = filter === 'all' ? '' : `?isRented=${filter === 'rented'}`;
    apiClient.get<Property[]>(`/properties${params}`)
      .then(r => setProperties(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProperties(); }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mülkü silmek istediğinize emin misiniz?')) return;
    await apiClient.delete(`/properties/${id}`);
    fetchProperties();
  };

  const filtered = properties.filter(p =>
    p.shortAddress?.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    p.propertyNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="properties-page">
      <div className="page-header">
        <h1 className="page-title">Mülkler</h1>
        <button className="btn-add" onClick={() => navigate('/mulkler/yeni')}>+ Yeni Mülk</button>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Adres, sahip, emlak no ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {(['all', 'rented', 'vacant'] as const).map(f => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tümü' : f === 'rented' ? 'Kirada' : 'Boş'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading">Yükleniyor...</div> : (
        <div className="properties-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>Mülk bulunamadı.</p>
              <button className="btn-add" onClick={() => navigate('/mulkler/yeni')}>İlk Mülkü Ekle</button>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} className={`property-card ${p.isRented ? 'rented' : 'vacant'}`}>
              <div className="property-card-header">
                <span className="property-number">{p.propertyNumber}</span>
                <span className={`status-chip ${p.isRented ? 'green' : 'gray'}`}>
                  {p.isRented ? 'Kirada' : 'Boş'}
                </span>
              </div>
              <div className="property-card-body">
                <h3>{p.district}, {p.city}</h3>
                <p className="address">{p.shortAddress}</p>
                <div className="property-meta">
                  <span>🏠 {p.propertyType}</span>
                  {p.roomCount && <span>🚪 {p.roomCount} Oda</span>}
                  {p.area && <span>📐 {p.area} m²</span>}
                </div>
                <div className="property-people">
                  <div><strong>Sahibi:</strong> {p.ownerName}</div>
                  {p.tenantName && <div><strong>Kiracı:</strong> {p.tenantName}</div>}
                  {p.contractEndDate && (
                    <div><strong>Sözleşme Bitiş:</strong> {new Date(p.contractEndDate).toLocaleDateString('tr-TR')}</div>
                  )}
                </div>
                <div className="property-rent">
                  <strong>{p.monthlyRent.toLocaleString('tr-TR')} ₺/ay</strong>
                </div>
              </div>
              <div className="property-card-footer">
                <button className="btn-icon" onClick={() => handleDelete(p.id)} title="Sil">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

