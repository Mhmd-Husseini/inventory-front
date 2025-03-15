import React from 'react';
import LoginForm from './LoginForm';
import { motion } from 'framer-motion';
import Logo from '../../assets/logo.svg';
import '../../styles/pages/LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <img 
            src={Logo} 
            alt="Inventory Manager Logo" 
            className="mx-auto h-16 w-auto" 
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/64x64?text=IM';
              e.currentTarget.onerror = null;
            }}
          />
          <h1 className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight">
            Inventory Manager
          </h1>
          <p className="mt-2 text-md text-gray-600">
            Streamlined inventory solutions for your business
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-6 px-4 shadow-xl sm:rounded-lg sm:px-10 overflow-hidden">
          <LoginForm />
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Inventory Manager. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 