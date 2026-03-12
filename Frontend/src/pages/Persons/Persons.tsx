﻿﻿import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import './Persons.css';

// Icons
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

interface Person {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  personType: string;
  tenantId: string;
}

export const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | '0' | '1'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', personType: 0 });
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchPersons = () => {
    setError('');
    const q = typeFilter === 'all' ? '' : `?personType=${typeFilter}`;
    apiClient.get<Person[]>(`/persons${q}`)
      .then(r => setPersons(r.data))
      .catch(err => {
        console.error('Kişiler yüklenemedi:', err.response?.data);
        setError(err.response?.data?.detail || err.response?.data?.title || 'Kişiler yüklenemedi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPersons(); }, [typeFilter]);

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', phone: '', email: '', personType: 0 });
    setEditingPerson(null);
    setShowForm(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Telefon formatı düzenle (sadece rakamlar)
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Telefon numarası en az 10 haneli olmalıdır.');
      return;
    }
    
    try {
      const submitData = { ...form, phone: cleanPhone };
      if (editingPerson) {
        await apiClient.put(`/persons/${editingPerson.id}`, submitData);
      } else {
        await apiClient.post('/persons', submitData);
      }
      resetForm();
      fetchPersons();
    } catch (err: any) {
      console.error('Kişi kaydetme hatası:', err.response?.data);
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const msgs = errorData.errors.map((e: any) => e.message).join(', ');
        setFormError(msgs);
      } else {
        setFormError(errorData?.detail || errorData?.title || 'Bir hata oluştu.');
      }
    }
  };

  const handleEdit = (person: Person) => {
    const nameParts = person.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setForm({
      firstName,
      lastName,
      phone: person.phone,
      email: person.email || '',
      personType: person.personType === 'Owner' ? 0 : 1
    });
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kişiyi silmek istediğinize emin misiniz?')) return;
    
    try {
      await apiClient.delete(`/persons/${id}`);
      fetchPersons();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Kişi silinemedi.');
    }
  };

  const filtered = persons.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div className="persons-page">
      <div className="page-header">
        <div>
          <h1>Kişiler</h1>
          <p className="page-subtitle">Mülk sahipleri ve kiracıları yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <PlusIcon />
          Yeni Kişi
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingPerson ? 'Kişi Düzenle' : 'Yeni Kişi Ekle'}</h2>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleSubmit} className="person-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Ahmet"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Yılmaz"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm({ ...form, phone: value });
                    }}
                    placeholder="5321234567"
                    maxLength={10}
                    required
                  />
                  <small style={{ color: '#64748b', fontSize: '0.85rem' }}>Başında 0 olmadan 10 hane</small>
                </div>
                <div className="form-group">
                  <label>E-posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Kişi Tipi *</label>
                <select
                  value={form.personType}
                  onChange={e => setForm({ ...form, personType: +e.target.value })}
                >
                  <option value={0}>Mülk Sahibi</option>
                  <option value={1}>Kiracı</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>İptal</button>
                <button type="submit" className="btn btn-primary">
                  {editingPerson ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="İsim veya telefon ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {(['all', '0', '1'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${typeFilter === f ? 'active' : ''}`}
              onClick={() => setTypeFilter(f)}
            >
              {f === 'all' ? 'Tümü' : f === '0' ? 'Sahipler' : 'Kiracılar'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Tip</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <p>Kişi bulunamadı.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td data-label="Ad Soyad" className="name-cell">{p.fullName}</td>
                    <td data-label="Telefon">{p.phone}</td>
                    <td data-label="E-posta" className="email-cell">{p.email || <span className="text-muted">—</span>}</td>
                    <td data-label="Tip">
                      <span className={`type-badge ${p.personType === 'Owner' ? 'type-badge--owner' : 'type-badge--tenant'}`}>
                        {p.personType === 'Owner' ? 'Sahip' : 'Kiracı'}
                      </span>
                    </td>
                    <td data-label="İşlemler" className="actions-cell">
                      <div className="actions-buttons">
                        <button className="icon-btn" onClick={() => handleEdit(p)} title="Düzenle">
                          <EditIcon />
                        </button>
                        <button className="icon-btn icon-btn--danger" onClick={() => handleDelete(p.id)} title="Sil">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
