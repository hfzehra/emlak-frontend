﻿import { useState } from 'react';
import { 
  useGetPropertiesQuery, 
  useCreatePropertyMutation, 
  useUpdatePropertyMutation, 
  useDeletePropertyMutation 
} from '../../services/propertyApi';
import { useGetHomeownersQuery } from '../../services/homeownerApi';
import './Properties.css';

export const Properties = () => {
  const { data: properties = [], isLoading } = useGetPropertiesQuery();
  const { data: homeowners = [] } = useGetHomeownersQuery();
  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tüm durumlar');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    roomCount: '',
    area: '',
    propertyType: 'Daire',
    status: 'Aktif',
    rentDate: '',
    tenantName: '',
    homeownerId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Güncelleme
        await updateProperty({
          id: editingId,
          address: formData.address,
          price: parseFloat(formData.price),
          roomCount: parseInt(formData.roomCount),
          area: parseInt(formData.area),
          propertyType: formData.propertyType,
          status: formData.status,
          rentDate: formData.rentDate,
          tenantName: formData.tenantName,
          homeownerId: formData.homeownerId || undefined
        }).unwrap();
        alert('Mülk başarıyla güncellendi!');
      } else {
        // Yeni ekleme
        await createProperty({
          address: formData.address,
          price: parseFloat(formData.price),
          roomCount: parseInt(formData.roomCount),
          area: parseInt(formData.area),
          propertyType: formData.propertyType,
          rentDate: formData.rentDate,
          tenantName: formData.tenantName,
          homeownerId: formData.homeownerId || undefined
        }).unwrap();
        alert('Mülk başarıyla eklendi!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleEdit = (property: any) => {
    setFormData({
      address: property.address,
      price: property.price.toString(),
      roomCount: property.roomCount.toString(),
      area: property.area.toString(),
      propertyType: property.propertyType,
      status: property.status,
      rentDate: property.rentDate.split('T')[0],
      tenantName: property.tenantName,
      homeownerId: property.homeownerId || ''
    });
    setEditingId(property.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu mülkü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteProperty(id).unwrap();
        alert('Mülk başarıyla silindi!');
      } catch (error) {
        console.error('Hata:', error);
        alert('Silme işlemi başarısız!');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      address: '',
      price: '',
      roomCount: '',
      area: '',
      propertyType: 'Daire',
      status: 'Aktif',
      rentDate: '',
      tenantName: '',
      homeownerId: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.propertyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Tüm durumlar' || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="properties-page">
      <h1 className="page-title">Mülkler</h1>

      <div className="filters-section">
        <input 
          type="text" 
          placeholder="Arama (Emlak No, Kiracı, Ev Sahibi, Adres)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option>Tüm durumlar</option>
          <option>Aktif</option>
          <option>Kiralandı</option>
          <option>Satıldı</option>
        </select>

        <button 
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'İptal' : 'Yeni Mülk Ekle +'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="property-form">
            <div className="form-row">
              <div className="form-group">
                <label>Kiracı Adı *</label>
                <input 
                  type="text" 
                  value={formData.tenantName}
                  onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                  required
                  placeholder="Kiracı adını girin"
                />
              </div>
              <div className="form-group">
                <label>Ev Sahibi *</label>
                <select 
                  value={formData.homeownerId}
                  onChange={(e) => setFormData({...formData, homeownerId: e.target.value})}
                  required
                >
                  <option value="">Ev sahibi seçin</option>
                  {homeowners.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Kira Tarihi *</label>
                <input 
                  type="date" 
                  value={formData.rentDate}
                  onChange={(e) => setFormData({...formData, rentDate: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Adres *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Mülk adresini girin"
                />
              </div>
              <div className="form-group">
                <label>Fiyat (₺) *</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Oda Sayısı *</label>
                <input 
                  type="number" 
                  value={formData.roomCount}
                  onChange={(e) => setFormData({...formData, roomCount: e.target.value})}
                  required
                  min="1"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Alan (m²) *</label>
                <input 
                  type="number" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  required
                  min="1"
                  placeholder="150"
                />
              </div>
              <div className="form-group">
                <label>Mülk Tipi *</label>
                <select 
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                >
                  <option>Daire</option>
                  <option>Villa</option>
                  <option>İşyeri</option>
                  <option>Arsa</option>
                  <option>Ofis</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durum *</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Aktif</option>
                  <option>Kiralandı</option>
                  <option>Satıldı</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="properties-table">
          <thead>
            <tr>
              <th>Emlak No</th>
              <th>Kiracı</th>
              <th>Ev Sahibi</th>
              <th>Adres</th>
              <th>Kira Tarihi</th>
              <th>Fiyat</th>
              <th>Oda</th>
              <th>Alan (m²)</th>
              <th>Tip</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr key={property.id}>
                  <td><strong>{property.propertyNumber}</strong></td>
                  <td>{property.tenantName}</td>
                  <td>{property.homeownerName}</td>
                  <td>{property.address}</td>
                  <td>{new Date(property.rentDate).toLocaleDateString('tr-TR')}</td>
                  <td>{property.price.toLocaleString('tr-TR')} ₺</td>
                  <td>{property.roomCount}</td>
                  <td>{property.area}</td>
                  <td>{property.propertyType}</td>
                  <td>
                    <span className={`status-badge ${property.status.toLowerCase()}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="edit-icon"
                      onClick={() => handleEdit(property)}
                      title="Düzenle"
                    >
                      ⚙️
                    </button>
                    <button 
                      className="delete-icon"
                      onClick={() => handleDelete(property.id)}
                      title="Sil"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="no-data">
                  {properties.length === 0 
                    ? 'Henüz mülk kaydı yok. Yeni eklemek için yukarıdaki butonu kullanın.' 
                    : 'Filtrelere uygun sonuç bulunamadı.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

