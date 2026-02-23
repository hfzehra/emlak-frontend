import { useState } from 'react';
import { PropertyList } from './features/properties/components/PropertyList';
import { CompanyList } from './features/companies/components/CompanyList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'companies' | 'properties'>('companies');

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-container">
          <h1 className="app-title">🏢 Emlak Yönetim Sistemi</h1>
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'companies' ? 'active' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Şirketler
            </button>
            <button 
              className={`nav-tab ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              Mülkler
            </button>
          </div>
        </div>
      </nav>
      
      <main className="app-main">
        {activeTab === 'companies' ? <CompanyList /> : <PropertyList />}
      </main>
    </div>
  );
}

export default App;

