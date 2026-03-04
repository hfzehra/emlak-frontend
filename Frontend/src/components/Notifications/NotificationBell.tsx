import { useState, useEffect } from 'react';
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
        🔔
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

