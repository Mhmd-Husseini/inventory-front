import React from 'react';
import RegisterForm from './RegisterForm';
import { motion } from 'framer-motion';
import Logo from '../../assets/logo.svg';

const RegisterPage: React.FC = () => {
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
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl"
      >
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 md:flex overflow-hidden">
          <div className="md:w-1/2 md:pr-8 md:border-r md:border-gray-200 hidden md:block">
            <div className="flex flex-col items-center justify-center h-full p-6">
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
            <RegisterForm />
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Inventory Manager. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 