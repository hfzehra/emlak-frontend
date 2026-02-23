﻿import { useState, useMemo } from 'react';
import { 
  useGetPropertiesQuery, 
  useCreatePropertyMutation, 
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  type Property 
} from '../../../services/propertyApi';
import './PropertyList.css';

type ModalMode = 'create' | 'edit' | null;

export const PropertyList = () => {
  const { data: properties, isLoading, error } = useGetPropertiesQuery();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Filtre ve arama state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: 0,
    roomCount: 0,
    area: 0,
    propertyType: 'Daire',
    status: 'Aktif',
  });

  // Filtrelenmiş ve aranmış mülkler
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property) => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filterType || property.propertyType === filterType;
      const matchesStatus = !filterStatus || property.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, searchTerm, filterType, filterStatus]);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      address: '',
      price: 0,
      roomCount: 0,
      area: 0,
      propertyType: 'Daire',
      status: 'Aktif',
    });
  };

  const openEditModal = (property: Property) => {
    setModalMode('edit');
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      address: property.address,
      price: property.price,
      roomCount: property.roomCount,
      area: property.area,
      propertyType: property.propertyType,
      status: property.status,
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProperty(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createProperty(formData).unwrap();
        alert('Mülk başarıyla eklendi!');
      } else if (modalMode === 'edit' && selectedProperty) {
        await updateProperty({ id: selectedProperty.id, ...formData }).unwrap();
        alert('Mülk başarıyla güncellendi!');
      }
      closeModal();
    } catch (err) {
      console.error('Hata:', err);
      alert('İşlem sırasında hata oluştu!');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`"${title}" mülkünü silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteProperty(id).unwrap();
        alert('Mülk başarıyla silindi!');
      } catch (err) {
        console.error('Hata:', err);
        alert('Mülk silinirken hata oluştu!');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {JSON.stringify(error)}</div>;

  return (
    <div className="property-container">
      <div className="header">
        <h1>Mülk Yönetimi</h1>
        <button onClick={openCreateModal} className="btn-primary">
          + Yeni Mülk Ekle
        </button>
      </div>

      {/* Filtre ve Arama Bölümü */}
      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Başlık, adres veya açıklama ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Tüm Tipler</option>
            <option value="Daire">Daire</option>
            <option value="Villa">Villa</option>
            <option value="İşyeri">İşyeri</option>
            <option value="Arsa">Arsa</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tüm Durumlar</option>
            <option value="Aktif">Aktif</option>
            <option value="Satıldı">Satıldı</option>
            <option value="Kiralandı">Kiralandı</option>
            <option value="Pasif">Pasif</option>
          </select>

          {(searchTerm || filterType || filterStatus) && (
            <button onClick={clearFilters} className="btn-clear">
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* Tablo Görünümü */}
      <div className="property-table-container">
        <div className="table-header">
          <h2>Mülkler ({filteredProperties.length})</h2>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="table-responsive">
            <table className="property-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Adres</th>
                  <th>Tip</th>
                  <th>Fiyat</th>
                  <th>Oda</th>
                  <th>Alan (m²)</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="property-title">{property.title}</td>
                    <td>{property.address}</td>
                    <td>
                      <span className="badge badge-type">{property.propertyType}</span>
                    </td>
                    <td className="property-price">
                      {property.price.toLocaleString('tr-TR')} ₺
                    </td>
                    <td>{property.roomCount}</td>
                    <td>{property.area}</td>
                    <td>
                      <span className={`badge badge-status status-${property.status.toLowerCase()}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => openEditModal(property)}
                        className="btn-edit"
                        title="Düzenle"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(property.id, property.title)}
                        className="btn-delete"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">
            {searchTerm || filterType || filterStatus 
              ? 'Filtrelere uygun mülk bulunamadı.' 
              : 'Henüz mülk eklenmemiş.'}
          </p>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Mülk Ekle' : 'Mülk Düzenle'}</h2>
              <button onClick={closeModal} className="modal-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Başlık *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Açıklama *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Adres *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Oda Sayısı *</label>
                  <input
                    type="number"
                    value={formData.roomCount}
                    onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Alan (m²) *</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mülk Tipi *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="Daire">Daire</option>
                    <option value="Villa">Villa</option>
                    <option value="İşyeri">İşyeri</option>
                    <option value="Arsa">Arsa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Durum *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Satıldı">Satıldı</option>
                    <option value="Kiralandı">Kiralandı</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating} 
                  className="btn-submit"
                >
                  {isCreating || isUpdating 
                    ? 'İşleniyor...' 
                    : modalMode === 'create' ? 'Ekle' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

