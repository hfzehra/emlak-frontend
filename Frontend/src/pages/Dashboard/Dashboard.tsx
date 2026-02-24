import { useGetPropertiesQuery } from '../../services/propertyApi';
import './Dashboard.css';

export const Dashboard = () => {
  const { data: properties = [], isLoading } = useGetPropertiesQuery();

  // İstatistikler
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === 'Aktif').length;
  const rentedProperties = properties.filter(p => p.status === 'Kiralandı').length;
  const totalRevenue = properties
    .filter(p => p.status === 'Kiralandı')
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="dashboard">
      <h1 className="page-title">Anasayfa</h1>

      <div className="dashboard-grid">
        {/* İstatistik Kartları */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3>Toplam Mülk</h3>
              <p className="stat-number">{totalProperties}</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Aktif Mülk</h3>
              <p className="stat-number">{activeProperties}</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>Kiralanan</h3>
              <p className="stat-number">{rentedProperties}</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Toplam Gelir</h3>
              <p className="stat-number">{totalRevenue.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>

        {/* Son Eklenen Mülkler */}
        <div className="dashboard-card recent-properties">
          <div className="card-header">
            <h2>📋 Son Eklenen Mülkler</h2>
            <button className="view-all-btn">Tümünü Gör →</button>
          </div>
          <div className="properties-table">
            <table>
              <thead>
                <tr>
                  <th>Emlak No</th>
                  <th>Kiracı</th>
                  <th>Ev Sahibi</th>
                  <th>Adres</th>
                  <th>Kira Tarihi</th>
                  <th>Fiyat</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="loading">Yükleniyor...</td>
                  </tr>
                ) : properties.length > 0 ? (
                  properties.slice(0, 5).map((property) => (
                    <tr key={property.id}>
                      <td><strong>{property.propertyNumber}</strong></td>
                      <td>{property.tenantName}</td>
                      <td>{property.homeownerName}</td>
                      <td>{property.address.substring(0, 40)}...</td>
                      <td>{new Date(property.rentDate).toLocaleDateString('tr-TR')}</td>
                      <td>{property.price.toLocaleString('tr-TR')} ₺</td>
                      <td>
                        <span className={`status-badge ${property.status.toLowerCase()}`}>
                          {property.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-data">
                      Henüz mülk kaydı bulunmuyor. Yeni mülk eklemek için "Mülkler" sayfasına gidin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yaklaşan Kira Tarihleri */}
        <div className="dashboard-card upcoming-rents">
          <div className="card-header">
            <h2>📅 Yaklaşan Kira Tarihleri</h2>
          </div>
          <div className="rent-list">
            {[...properties]
              .sort((a, b) => new Date(a.rentDate).getTime() - new Date(b.rentDate).getTime())
              .slice(0, 6)
              .map((property) => (
                <div key={property.id} className="rent-item">
                  <div className="rent-icon">🏠</div>
                  <div className="rent-info">
                    <strong>{property.tenantName}</strong>
                    <p className="rent-address">{property.address.substring(0, 30)}...</p>
                  </div>
                  <div className="rent-date">
                    {new Date(property.rentDate).toLocaleDateString('tr-TR', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                </div>
              ))}
            {properties.length === 0 && (
              <p className="no-data">Henüz kira kaydı bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* Grafik Alanı */}
        <div className="dashboard-card chart-section">
          <div className="chart-header">
            <h2>📊 AYLARA GÖRE KAZANILAN PARA MİKTARI</h2>
            <select className="chart-filter">
              <option>Bu Ay</option>
              <option>Bu Yıl</option>
              <option>Tümü</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <span className="chart-icon">📈</span>
                <p>Grafik Alanı</p>
                <small>Aylık gelir grafiği burada görüntülenecek</small>
              </div>
            </div>
          </div>
          <div className="chart-total">
            <span>Toplam Gelir</span>
            <span className="total-amount">{totalRevenue.toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>

        {/* Durum Grafiği */}
        <div className="dashboard-card donut-chart">
          <h2>📊 Mülk Durumu</h2>
          <div className="donut-container">
            <div className="donut-placeholder">
              <div className="donut-center">
                <span className="donut-percentage">
                  {totalProperties > 0 
                    ? Math.round((rentedProperties / totalProperties) * 100)
                    : 0}%
                </span>
                <span className="donut-label">Doluluk Oranı</span>
              </div>
            </div>
          </div>
          <div className="donut-legend">
            <div className="legend-item">
              <span className="legend-color green"></span>
              <span>Aktif ({activeProperties})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color blue"></span>
              <span>Kiralanan ({rentedProperties})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color gray"></span>
              <span>Diğer ({totalProperties - activeProperties - rentedProperties})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

