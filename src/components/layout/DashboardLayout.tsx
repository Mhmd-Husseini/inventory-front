import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import '../../styles/pages/Dashboard.css';

const DashboardLayout: React.FC = () => {
  const { state, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} />
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="menu-button"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="dashboard-title">Inventory Dashboard</h1>
          </div>
          <div className="user-info">
            <span className="user-welcome">Welcome, {state.user?.name}</span>
            <button
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 