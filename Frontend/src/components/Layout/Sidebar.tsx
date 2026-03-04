import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

interface SidebarProps {
  onLogout?: () => void;
  menuItems?: MenuItem[];
  readonly _v?: never;
}

const DEFAULT_MENU: MenuItem[] = [
  { path: '/', icon: '/home.png', label: 'Anasayfa' },
  { path: '/takvim', icon: '/calendar.png', label: 'Takvim' },
  { path: '/mulkler', icon: '/house.png', label: 'Mülkler' },
  { path: '/kisiler', icon: '/person.png', label: 'Kişiler' },
];

export const Sidebar = ({ onLogout, menuItems = DEFAULT_MENU }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🏠 EMLAK</h2>
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
          <span className="sidebar-label">Çıkış</span>
        </button>
      </div>
    </div>
  );
};
