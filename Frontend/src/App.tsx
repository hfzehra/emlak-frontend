import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Calendar } from './pages/Calendar/Calendar';
import { Properties } from './pages/Properties/Properties';
import { CompanyList } from './features/companies/components/CompanyList';
import { Homeowners } from './pages/Homeowners/Homeowners';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sirketler" element={<CompanyList />} />
          <Route path="takvim" element={<Calendar />} />
          <Route path="mulkler" element={<Properties />} />
          <Route path="ev-sahibi" element={<Homeowners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

