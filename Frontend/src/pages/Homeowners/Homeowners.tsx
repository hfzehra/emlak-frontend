import { useState } from 'react';
import { 
  useGetHomeownersQuery, 
  useCreateHomeownerMutation, 
  useUpdateHomeownerMutation, 
  useDeleteHomeownerMutation 
} from '../../services/homeownerApi';
import './Homeowners.css';

export const Homeowners = () => {
  const { data: homeowners = [], isLoading } = useGetHomeownersQuery();
  const [createHomeowner] = useCreateHomeownerMutation();
  const [updateHomeowner] = useUpdateHomeownerMutation();
  const [deleteHomeowner] = useDeleteHomeownerMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateHomeowner({
          id: editingId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        }).unwrap();
        alert('Ev sahibi başarıyla güncellendi!');
      } else {
        await createHomeowner({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        }).unwrap();
        alert('Ev sahibi başarıyla eklendi!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleEdit = (homeowner: any) => {
    setFormData({
      name: homeowner.name,
      phone: homeowner.phone,
      email: homeowner.email,
      address: homeowner.address
    });
    setEditingId(homeowner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu ev sahibini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteHomeowner(id).unwrap();
        alert('Ev sahibi başarıyla silindi!');
      } catch (error) {
        console.error('Hata:', error);
        alert('Silme işlemi başarısız!');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredHomeowners = homeowners.filter(h => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="homeowners-page">
      <h1 className="page-title">Ev Sahipleri</h1>

      <div className="filters-section">
        <input 
          type="text" 
          placeholder="Arama (Ad, Telefon, Email, Adres)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button 
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'İptal' : 'Yeni Ev Sahibi Ekle +'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="homeowner-form">
            <div className="form-row">
              <div className="form-group">
                <label>Ad Soyad *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Ev sahibinin adını girin"
                />
              </div>
              <div className="form-group">
                <label>Telefon *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="5XX XXX XX XX"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Adres *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Ev sahibinin adresini girin"
                />
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
        <table className="homeowners-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Adres</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredHomeowners.length > 0 ? (
              filteredHomeowners.map((homeowner) => (
                <tr key={homeowner.id}>
                  <td><strong>{homeowner.name}</strong></td>
                  <td>{homeowner.phone}</td>
                  <td>{homeowner.email}</td>
                  <td>{homeowner.address}</td>
                  <td>{new Date(homeowner.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-icon"
                      onClick={() => handleEdit(homeowner)}
                      title="Düzenle"
                    >
                      ⚙️
                    </button>
                    <button 
                      className="delete-icon"
                      onClick={() => handleDelete(homeowner.id)}
                      title="Sil"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-data">
                  {homeowners.length === 0 
                    ? 'Henüz ev sahibi kaydı yok. Yeni eklemek için yukarıdaki butonu kullanın.' 
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

