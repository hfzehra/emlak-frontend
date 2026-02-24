import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '/home.png', label: 'Anasayfa' },
    { path: '/sirketler', icon: '/business.png', label: 'Sirketler' },
    { path: '/takvim', icon: '/calendar.png', label: 'Takvim' },
    { path: '/mulkler', icon: '/house.png', label: 'Mulkler' },
    { path: '/ev-sahibi', icon: '/person.png', label: 'Ev sahibi' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>EMLAK ADMIN PANEL</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <img src={item.icon} alt={item.label} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <img src="/logout.png" alt="Logout" className="sidebar-icon" />
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
};
