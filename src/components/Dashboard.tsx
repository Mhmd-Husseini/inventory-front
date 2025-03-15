import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Dashboard.css';

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Inventory Dashboard</h1>
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
          <div className="dashboard-placeholder">
            <svg
              className="placeholder-icon"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
            <h2 className="placeholder-title">Welcome to Your Inventory Management</h2>
            <p className="placeholder-text">
              This is a starting point for your inventory management dashboard.
              You can add features like product tracking, order management, and more!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 