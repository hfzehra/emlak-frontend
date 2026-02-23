import { useState } from 'react';
import { 
  useGetCompaniesQuery, 
  useCreateCompanyMutation, 
  useUpdateCompanyMutation, 
  useDeleteCompanyMutation,
  type Company 
} from '../../../services/companyApi';
import './CompanyList.css';

export const CompanyList = () => {
  const { data: companies, isLoading, error } = useGetCompaniesQuery();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setEditingCompany(null);
    setShowForm(false);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu şirketi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCompany(id).unwrap();
        alert('Şirket başarıyla silindi!');
      } catch (err) {
        console.error('Hata:', err);
        alert('Şirket silinirken hata oluştu!');
      }
    }
  };

  const handleSelectCompany = (companyId: string) => {
    localStorage.setItem('companyId', companyId);
    alert('Şirket seçildi! Artık bu şirketin mülklerini görüntülüyorsunuz.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await updateCompany({ id: editingCompany.id, ...formData }).unwrap();
        alert('Şirket başarıyla güncellendi!');
      } else {
        const result = await createCompany(formData).unwrap();
        alert('Şirket başarıyla eklendi!');
        // Yeni oluşturulan şirketi otomatik olarak seç
        if (result.id) {
          localStorage.setItem('companyId', result.id);
        }
      }
      resetForm();
    } catch (err) {
      console.error('Hata:', err);
      alert(editingCompany ? 'Şirket güncellenirken hata oluştu!' : 'Şirket eklenirken hata oluştu!');
    }
  };

  const currentCompanyId = localStorage.getItem('companyId');

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {JSON.stringify(error)}</div>;

  return (
    <div className="company-container">
      <div className="header">
        <h1>Şirket Yönetimi</h1>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-primary">
          {showForm ? 'İptal' : 'Yeni Şirket Ekle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="company-form">
          <h2>{editingCompany ? 'Şirket Güncelle' : 'Yeni Şirket Ekle'}</h2>
          <div className="form-group">
            <label>Şirket Adı:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>E-posta:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefon:</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Adres:</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isCreating || isUpdating} className="btn-success">
              {isCreating || isUpdating ? 'İşleniyor...' : editingCompany ? 'Güncelle' : 'Ekle'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="company-list">
        <h2>Şirketler ({companies?.length || 0})</h2>
        {companies && companies.length > 0 ? (
          <div className="company-grid">
            {companies.map((company) => (
              <div 
                key={company.id} 
                className={`company-card ${currentCompanyId === company.id ? 'selected' : ''}`}
              >
                <div className="company-header">
                  <h3>{company.name}</h3>
                  {currentCompanyId === company.id && (
                    <span className="badge-active">Seçili</span>
                  )}
                </div>
                <div className="company-details">
                  <p><strong>📧</strong> {company.email}</p>
                  <p><strong>📞</strong> {company.phone}</p>
                  <p><strong>📍</strong> {company.address}</p>
                  <p className={`status ${company.isActive ? 'aktif' : 'pasif'}`}>
                    {company.isActive ? 'Aktif' : 'Pasif'}
                  </p>
                </div>
                <div className="card-actions">
                  <button 
                    onClick={() => handleSelectCompany(company.id)} 
                    className="btn-select"
                    disabled={currentCompanyId === company.id}
                  >
                    {currentCompanyId === company.id ? 'Seçili' : 'Seç'}
                  </button>
                  <button onClick={() => handleEdit(company)} className="btn-edit">
                    Düzenle
                  </button>
                  <button onClick={() => handleDelete(company.id)} className="btn-delete">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Henüz şirket eklenmemiş.</p>
        )}
      </div>
    </div>
  );
};

