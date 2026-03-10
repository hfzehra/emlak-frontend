import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { apiClient } from '../../services/apiClient';
import './Calendar.css';

type Value = Date | null | [Date | null, Date | null];

interface CalendarEvent {
  date: string; type: string; title: string;
  description: string; relatedId: string; amount?: number; isPaid: boolean;
}

const typeColor: Record<string, string> = {
  ContractStart: '#10b981',
  ContractEnd: '#f59e0b',
  RentDue: '#3b82f6',
};

export const Calendar = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<CalendarEvent[] | null>(null);
  const [popupDate, setPopupDate] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 7, 0).toISOString();
    apiClient.get<CalendarEvent[]>(`/calendar/events?from=${from}&to=${to}`)
      .then(r => setEvents(r.data)).catch(() => {});
  }, []);

  const getEventsForDate = (d: Date) =>
    events.filter(e => {
      const ed = new Date(e.date);
      return ed.getFullYear() === d.getFullYear() &&
             ed.getMonth() === d.getMonth() &&
             ed.getDate() === d.getDate();
    });

  const tileContent = ({ date: d }: { date: Date }) => {
    const dayEvents = getEventsForDate(d);
    if (!dayEvents.length) return null;
    const handleMoreClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPopupDate(d);
      setPopupEvents(dayEvents);
    };
    return (
      <div className="tile-content">
        {dayEvents.slice(0, 1).map((e, i) => (
          <div key={i} className="tenant-badge" style={{ background: typeColor[e.type] ?? '#6366f1' }} title={e.description}>
            {e.type === 'ContractStart' ? '🟢' : e.type === 'ContractEnd' ? '📋' : '💰'} {e.description.substring(0, 14)}
          </div>
        ))}
        {dayEvents.length > 1 && (
          <div
            className="tenant-badge"
            style={{ background: '#6b7280', cursor: 'pointer' }}
            onClick={handleMoreClick}
          >
            +{dayEvents.length - 1} daha
          </div>
        )}
      </div>
    );
  };

  const tileClassName = ({ date: d }: { date: Date }) =>
    getEventsForDate(d).length > 0 ? 'has-tenant' : '';

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  const typeLabel: Record<string, string> = {
    ContractStart: 'Sözleşme Başlangıç',
    ContractEnd: 'Sözleşme Bitiş',
    RentDue: 'Kira Vadesi',
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1 className="page-title">Takvim</h1>
      </div>
      <div className="calendar-info">
        <p className="info-text">📋 Sözleşme başlangıç/bitiş tarihleri ve kira vadeleri</p>
      </div>
      <div className="calendar-legend" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(typeColor).map(([type, color]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
            {typeLabel[type] ?? type}
          </span>
        ))}
      </div>
      <div className="calendar-container">
        <ReactCalendar onChange={setDate} value={date} locale="tr-TR"
          tileContent={tileContent} tileClassName={tileClassName} className="custom-calendar" />
      </div>

      {/* Gün Detay Popup */}
      {popupEvents && popupDate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPopupEvents(null)}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', minWidth: '320px', maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                📅 {popupDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => setPopupEvents(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {popupEvents.map((e, i) => (
                <div key={i} style={{ padding: '0.7rem', borderRadius: '8px', borderLeft: `4px solid ${typeColor[e.type] ?? '#6366f1'}`, background: '#f8fafc' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{e.title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{e.description}</div>
                  {e.amount && <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginTop: '0.2rem' }}>{e.amount.toLocaleString('tr-TR')} ₺</div>}
                  <span style={{ fontSize: '0.75rem', background: typeColor[e.type] ?? '#6366f1', color: '#fff', borderRadius: '4px', padding: '0.1rem 0.4rem', display: 'inline-block', marginTop: '0.3rem' }}>
                    {typeLabel[e.type] ?? e.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <h3>Yaklaşan Olaylar</h3>
        <div className="upcoming-rents">
          {upcoming.length === 0 ? <p style={{ color: '#9ca3af' }}>Yaklaşan olay yok.</p> : upcoming.map((e, i) => (
            <div key={i} className="rent-item" style={{ borderLeftColor: typeColor[e.type] ?? '#6366f1' }}>
              <span className="rent-date">{new Date(e.date).toLocaleDateString('tr-TR')}</span>
              <span className="rent-tenant">{e.title}</span>
              <span className="rent-address">{e.description}</span>
              {e.amount && <span style={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{e.amount.toLocaleString('tr-TR')} ₺</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
