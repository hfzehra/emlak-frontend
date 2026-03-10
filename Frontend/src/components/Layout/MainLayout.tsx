﻿import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Sidebar } from './Sidebar';
import { NotificationBell } from '../Notifications/NotificationBell';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import type { AppDispatch } from '../../app/store';
import './MainLayout.css';

const BASE_MENU = [
  { path: '/', icon: '/home.png', label: 'Anasayfa' },
  { path: '/takvim', icon: '/calendar.png', label: 'Takvim' },
  { path: '/mulkler', icon: '/house.png', label: 'Mülkler' },
  { path: '/kisiler', icon: '/person.png', label: 'Kişiler' },
  { path: '/arsiv', icon: '/archive.png', label: 'Arşiv' },
];
const SUPER_ADMIN_MENU = [
  ...BASE_MENU,
  { path: '/super-admin', icon: '/business.png', label: 'Yönetim' },
];

export const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = user?.role === 'SuperAdmin' ? SUPER_ADMIN_MENU : BASE_MENU;

  return (
    <div className="main-layout">
      <Sidebar onLogout={handleLogout} menuItems={menuItems} />
      <div className="main-content">
        <div className="content-header">
          <div className="header-user">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role">{user?.companyName}</span>
          </div>
          <NotificationBell />
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
