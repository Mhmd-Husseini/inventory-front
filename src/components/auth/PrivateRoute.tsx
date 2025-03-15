import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/PrivateRoute.css';

interface PrivateRouteProps {
  redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return state.isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute; 