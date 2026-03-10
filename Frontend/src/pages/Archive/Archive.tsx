import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Archive.css';

// Archive box icon (flaticon style SVG)
const ArchiveBoxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const RestoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

interface ArchivedProperty {
  id: string;
  propertyNumber: string;
  shortAddress: string;
  city: string;
  district: string;
  isRented: boolean;
  monthlyRent: number;
  ownerName: string;
  tenantName?: string;
}

export const Archive = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<ArchivedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchArchived = async () => {
    setLoading(true);
    try {
      const r = await apiClient.get<ArchivedProperty[]>('/properties/archived');
      setProperties(r.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Arşiv yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async (id: string) => {
    if (!confirm('Bu mülkü arşivden geri almak istediğinize emin misiniz?')) return;
    setRestoringId(id);
    try {
      await apiClient.post(`/properties/${id}/restore`, {});
      setSuccessMsg('Mülk başarıyla geri alındı!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await fetchArchived();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Mülk geri alınamadı.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setRestoringId(null);
    }
  };

  const filtered = properties.filter(p =>
    p.propertyNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.shortAddress.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="archive-page">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeftIcon />
            <span>Geri</span>
          </button>
          <div>
            <h1 className="page-title">
              <ArchiveBoxIcon />
              Arşiv
            </h1>
            <p className="page-subtitle">Arşivlenen mülkleri görüntüleyin ve yönetin</p>
          </div>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Mülk no, adres, sahip ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="archive-count">
          Toplam: <strong>{properties.length}</strong> arşivlenmiş mülk
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-archive">
          <div className="empty-archive-icon">
            <ArchiveBoxIcon />
          </div>
          <h3>{search ? 'Arama sonucu bulunamadı.' : 'Arşivde mülk yok.'}</h3>
          <p>{search ? 'Farklı bir arama terimi deneyin.' : 'Arşivlenen mülkler burada görünecek.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emlak No</th>
                <th>Adres</th>
                <th>Sahibi</th>
                <th>Kiracı</th>
                <th>Aylık Kira</th>
                <th>Son Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td data-label="Emlak No">
                    <span className="property-number">{p.propertyNumber}</span>
                  </td>
                  <td data-label="Adres">
                    <div className="address-cell">
                      <span className="address-main">{p.district}, {p.city}</span>
                      <span className="address-detail">{p.shortAddress}</span>
                    </div>
                  </td>
                  <td data-label="Sahibi">{p.ownerName}</td>
                  <td data-label="Kiracı">{p.tenantName || <span className="text-muted">—</span>}</td>
                  <td data-label="Aylık Kira">
                    <span className="rent-amount">{p.monthlyRent.toLocaleString('tr-TR')} ₺</span>
                  </td>
                  <td data-label="Son Durum">
                    <span className={`status-badge ${p.isRented ? 'status-badge--rented' : 'status-badge--vacant'}`}>
                      {p.isRented ? 'Kiradaydı' : 'Boştu'}
                    </span>
                  </td>
                  <td data-label="İşlem">
                    <button
                      className="btn btn-restore"
                      onClick={() => handleRestore(p.id)}
                      disabled={restoringId === p.id}
                      title="Arşivden Geri Al"
                    >
                      <RestoreIcon />
                      {restoringId === p.id ? 'Geri Alınıyor...' : 'Geri Al'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

