import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/LoginForm.css';

const LoginForm: React.FC = () => {
  const { login, state } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <>
      <div className="login-title">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>
      
      {state.error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-error"
        >
          <div className="login-error-icon">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span>{state.error}</span>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className="login-form-inputs">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            error={errors.email}
          />
          
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
        </div>
        
        <div className="login-form-checkbox">
          <div className="checkbox-container">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="checkbox-input"
            />
            <label htmlFor="remember-me" className="checkbox-label">
              Remember me
            </label>
          </div>
          
          <div>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={state.isLoading}
          size="lg"
        >
          Sign In
        </Button>
        
        <div className="login-divider">
          <div className="register-link-container">
            <span className="register-text">New to Inventory Manager?</span>
            <Link 
              to="/register" 
              className="register-link"
            >
              Create an account
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm; 