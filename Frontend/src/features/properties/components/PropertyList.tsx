﻿import { useState } from 'react';
import { useGetPropertiesQuery, useCreatePropertyMutation, type Property } from '../../../services/propertyApi';
import './PropertyList.css';

export const PropertyList = () => {
  const { data: properties, isLoading, error } = useGetPropertiesQuery();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: 0,
    roomCount: 0,
    area: 0,
    propertyType: 'Daire',
    companyId: localStorage.getItem('companyId') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProperty(formData).unwrap();
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        address: '',
        price: 0,
        roomCount: 0,
        area: 0,
        propertyType: 'Daire',
        companyId: localStorage.getItem('companyId') || '',
      });
      alert('Mülk başarıyla eklendi!');
    } catch (err) {
      console.error('Hata:', err);
      alert('Mülk eklenirken hata oluştu!');
    }
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {JSON.stringify(error)}</div>;

  return (
    <div className="property-container">
      <div className="header">
        <h1>Emlak Yönetim Sistemi</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'İptal' : 'Yeni Mülk Ekle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="property-form">
          <h2>Yeni Mülk Ekle</h2>
          <div className="form-group">
            <label>Başlık:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Açıklama:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Adres:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fiyat (TL):</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Oda Sayısı:</label>
              <input
                type="number"
                value={formData.roomCount}
                onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Alan (m²):</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mülk Tipi:</label>
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
          <button type="submit" disabled={isCreating} className="btn-success">
            {isCreating ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </form>
      )}

      <div className="property-list">
        <h2>Mülkler ({properties?.length || 0})</h2>
        {properties && properties.length > 0 ? (
          <div className="property-grid">
            {properties.map((property: Property) => (
              <div key={property.id} className="property-card">
                <h3>{property.title}</h3>
                <p className="description">{property.description}</p>
                <div className="property-details">
                  <p><strong>📍</strong> {property.address}</p>
                  <p><strong>💰</strong> {property.price.toLocaleString('tr-TR')} TL</p>
                  <p><strong>🏠</strong> {property.roomCount} Oda</p>
                  <p><strong>📐</strong> {property.area} m²</p>
                  <p><strong>🏢</strong> {property.propertyType}</p>
                  <p className={`status ${property.status.toLowerCase()}`}>
                    {property.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Henüz mülk eklenmemiş.</p>
        )}
      </div>
    </div>
  );
};

