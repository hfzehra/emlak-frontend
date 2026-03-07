import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Calendar } from './pages/Calendar/Calendar';
import { Properties } from './pages/Properties/Properties';
import { PropertyDetail } from './pages/Properties/PropertyDetail';
import { PropertyWizard } from './pages/Properties/Wizard/PropertyWizard';
import { Persons } from './pages/Persons/Persons';
import { SuperAdmin } from './pages/SuperAdmin/SuperAdmin';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sifre-sifirla" element={<ResetPassword />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="takvim" element={<Calendar />} />
          <Route path="mulkler" element={<Properties />} />
          <Route path="mulkler/yeni" element={<PropertyWizard />} />
          <Route path="mulkler/:id" element={<PropertyDetail />} />
          <Route path="kisiler" element={<Persons />} />
          <Route path="super-admin" element={<ProtectedRoute requiredRole="SuperAdmin"><SuperAdmin /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
