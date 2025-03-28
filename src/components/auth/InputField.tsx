import React, { ChangeEvent, ReactNode } from 'react';
import '../../styles/components/InputField.css';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
  error,
  className = '',
}) => {
  return (
    <div className={`input-field-container ${className}`}>
      <label 
        htmlFor={name} 
        className="input-label"
      >
        {label} {required && <span className="input-label-required">*</span>}
      </label>
      <div className="input-wrapper">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          onFocus={() => {}}
          onBlur={() => {}}
          className={`input-element ${error ? 'input-error' : ''}`}
        />
        {error && (
          <div className="error-icon">
            <div>
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField; 