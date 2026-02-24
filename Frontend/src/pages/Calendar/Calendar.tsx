import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useGetPropertiesQuery } from '../../services/propertyApi';
import './Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calendar = () => {
  const [date, setDate] = useState<Value>(new Date());
  const { data: properties = [] } = useGetPropertiesQuery();

  // Belirli bir günde kira tarihi olan mülkleri bul
  const getTenantsForDate = (checkDate: Date) => {
    return properties.filter(property => {
      if (!property.tenantName || !property.rentDate) return false;
      
      const rentDate = new Date(property.rentDate);
      
      // Sadece tarihi karşılaştır (saat kısmını yok say)
      return rentDate.getFullYear() === checkDate.getFullYear() &&
             rentDate.getMonth() === checkDate.getMonth() &&
             rentDate.getDate() === checkDate.getDate();
    });
  };

  // Takvim hücrelerinde özel içerik göstermek için
  const tileContent = ({ date: tileDate }: { date: Date }) => {
    const tenants = getTenantsForDate(tileDate);
    
    if (tenants.length === 0) return null;
    
    return (
      <div className="tile-content">
        {tenants.map((property, idx) => (
          <div key={idx} className="tenant-badge" title={`${property.tenantName} - ${property.address}`}>
            📌 {property.tenantName}
          </div>
        ))}
      </div>
    );
  };

  // Takvim hücrelerine özel class eklemek için
  const tileClassName = ({ date: tileDate }: { date: Date }) => {
    const tenants = getTenantsForDate(tileDate);
    return tenants.length > 0 ? 'has-tenant' : '';
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1 className="page-title">Takvim - Kira Tarihleri</h1>
        <button className="notification-icon">🔔</button>
      </div>

      <div className="calendar-info">
        <p className="info-text">
          📌 Kiracı kira tarihlerini görmek için takvimde gezinin
        </p>
      </div>

      <div className="calendar-container">
        <ReactCalendar
          onChange={setDate}
          value={date}
          locale="tr-TR"
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="custom-calendar"
        />
      </div>

      <div className="calendar-legend">
        <h3>Yaklaşan Kira Tarihleri</h3>
        <div className="upcoming-rents">
          {properties
            .filter(p => p.tenantName && p.rentDate)
            .sort((a, b) => new Date(a.rentDate).getTime() - new Date(b.rentDate).getTime())
            .slice(0, 10)
            .map((property, idx) => (
              <div key={idx} className="rent-item">
                <span className="rent-date">
                  {new Date(property.rentDate).toLocaleDateString('tr-TR')}
                </span>
                <span className="rent-tenant">{property.tenantName}</span>
                <span className="rent-address">{property.address}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

