﻿import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import './NotificationBell.css';

interface Notification {
  id: string; type: string; title: string; message: string;
  isRead: boolean; createdAt: string;
}

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get<Notification[]>('/notifications?unreadOnly=false');
      setNotifications(res.data);
    } catch { /* sessiz hata */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* sessiz hata */ }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeIcon = (type: string) => {
    if (type.includes('Contract')) return '📋';
    if (type.includes('Overdue')) return '🔴';
    if (type.includes('Due')) return '⏰';
    return '🔔';
  };

  return (
    <div className="notification-wrapper">
      <button className="bell-btn" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notif-header">
            <span>Bildirimler</span>
            <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>
          {notifications.length === 0 ? (
            <div className="no-notif">Bildirim yok</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item ${n.isRead ? 'read' : 'unread'}`}
                onClick={() => !n.isRead && markRead(n.id)}
              >
                <span className="notif-icon">{typeIcon(n.type)}</span>
                <div className="notif-body">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleDateString('tr-TR')}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

