import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import ProductTypes from './components/pages/ProductTypes';
import Items from './components/pages/Items';
import './App.css';

const ItemsRedirect = () => {
  const { productTypeId } = useParams();
  return <Navigate to={`/dashboard/product-types/${productTypeId}/items`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/product-types" replace />} />
              <Route path="product-types" element={<ProductTypes />} />
              <Route path="product-types/:productTypeId/items" element={<Items />} />
              {/* Keep the old route temporarily for backward compatibility */}
              <Route path="items/:productTypeId" element={<ItemsRedirect />} />
            </Route>
          </Route>
          
          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {background: '#fff',color: '#333',},
            success: {iconTheme: {primary:'#10b981',secondary: '#fff'}},
            error: {iconTheme: {primary: '#ef4444',secondary: '#fff'}},
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App
