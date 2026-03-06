﻿import { useState, useEffect } from 'react';
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
  RentPaid: '#16a34a',
};

export const Calendar = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();
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
    return (
      <div className="tile-content">
        {dayEvents.slice(0, 2).map((e, i) => (
          <div key={i} className="tenant-badge" style={{ background: typeColor[e.type] ?? '#6366f1' }} title={e.description}>
            {e.type === 'ContractStart' ? '🟢' : e.type === 'ContractEnd' ? '📋' : e.type === 'RentPaid' ? '✅' : '💰'} {e.description.substring(0, 18)}
          </div>
        ))}
        {dayEvents.length > 2 && <div className="tenant-badge" style={{ background: '#6b7280' }}>+{dayEvents.length - 2}</div>}
      </div>
    );
  };

  const tileClassName = ({ date: d }: { date: Date }) =>
    getEventsForDate(d).length > 0 ? 'has-tenant' : '';

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

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
            {type === 'ContractStart' ? 'Sözleşme Başlangıç' : type === 'ContractEnd' ? 'Sözleşme Bitiş' : type === 'RentDue' ? 'Kira Vadesi' : 'Ödendi'}
          </span>
        ))}
      </div>
      <div className="calendar-container">
        <ReactCalendar onChange={setDate} value={date} locale="tr-TR"
          tileContent={tileContent} tileClassName={tileClassName} className="custom-calendar" />
      </div>
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
