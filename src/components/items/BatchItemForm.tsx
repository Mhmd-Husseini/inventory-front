import React, { useState } from 'react';
import Button from '../common/Button';
import '../../styles/components/ProductTypeForm.css';

interface BatchItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serialNumbers: string[]) => Promise<void>;
  isLoading: boolean;
  productTypeId: number;
}

const BatchItemForm: React.FC<BatchItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  productTypeId
}) => {
  const [serialNumbersText, setSerialNumbersText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serialNumbersText.trim()) {
      setError('At least one serial number is required');
      return;
    }
    
    // Parse serial numbers from text area (one per line)
    const serialNumbers = serialNumbersText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (serialNumbers.length === 0) {
      setError('At least one valid serial number is required');
      return;
    }
    
    try {
      await onSubmit(serialNumbers);
      setSerialNumbersText('');
      onClose();
    } catch (err) {
      setError('Failed to save items. Please try again.');
    }
  };

  if (!isOpen) return null;

  // Count unique valid serial numbers
  const validSerialNumbers = serialNumbersText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const uniqueCount = new Set(validSerialNumbers).size;
  const duplicatesCount = validSerialNumbers.length - uniqueCount;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Batch Add Items</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-type-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="serialNumbers">
              Serial Numbers <span className="required">*</span>
              <span className="helper-text"> (One per line)</span>
            </label>
            <textarea
              id="serialNumbers"
              className={error ? 'input-error' : ''}
              value={serialNumbersText}
              onChange={(e) => setSerialNumbersText(e.target.value)}
              disabled={isLoading}
              placeholder="Enter one serial number per line&#10;Example:&#10;LEGO-001&#10;LEGO-002&#10;LEGO-003"
              rows={10}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
            />
            <div className="input-info">
              {validSerialNumbers.length > 0 && (
                <div className="serial-number-count">
                  <span>{uniqueCount} unique serial number{uniqueCount !== 1 ? 's' : ''}</span>
                  {duplicatesCount > 0 && (
                    <span className="warning"> ({duplicatesCount} duplicate{duplicatesCount !== 1 ? 's' : ''})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="batch-info">
            <h4>Instructions:</h4>
            <ul>
              <li>Enter one serial number per line</li>
              <li>Duplicate serial numbers will be ignored</li>
              <li>Empty lines will be skipped</li>
              <li>Leading and trailing spaces will be trimmed</li>
            </ul>
          </div>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || validSerialNumbers.length === 0}
            >
              {isLoading ? 'Adding...' : `Add ${uniqueCount} Item${uniqueCount !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchItemForm; 