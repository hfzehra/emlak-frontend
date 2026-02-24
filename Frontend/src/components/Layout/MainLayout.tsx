import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

export const MainLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('companyId');
    alert('Çıkış yapıldı!');
  };

  return (
    <div className="main-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <div className="content-header">
          <button className="notification-btn">🔔</button>
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

