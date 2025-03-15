import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/RegisterForm.css';

const RegisterForm: React.FC = () => {
  const { register, state } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        );
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="register-form-container"
    >
      <div className="register-title">
        <h2>Create Account</h2>
        <p>Join our inventory management platform</p>
      </div>
      
      {state.error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="register-error"
        >
          <div className="register-error-icon">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span>{state.error}</span>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="register-form-inputs">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            error={errors.name}
          />
          
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
          
          <InputField
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            error={errors.password_confirmation}
          />
        </div>
        
        <div className="register-terms">
          <div className="terms-checkbox-container">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="terms-checkbox"
            />
          </div>
          <div className="terms-label-container">
            <label htmlFor="terms" className="terms-label">
              I agree to the{' '}
              <a href="#" className="terms-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>
            </label>
            {errors.terms && (
              <p className="terms-error">{errors.terms}</p>
            )}
          </div>
        </div>
        
        <div className="register-remember-me">
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
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={state.isLoading}
          size="lg"
        >
          Create Account
        </Button>
        
        <div className="register-divider">
          <div className="login-link-container">
            <span className="login-text">Already have an account?</span>
            <Link 
              to="/login" 
              className="login-link"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm; 