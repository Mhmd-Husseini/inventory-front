import React, { useState, useEffect } from 'react';
import { Item } from '../../services/itemService';
import Button from '../common/Button';
import '../../styles/components/Form.css';
import '../../styles/components/ProductTypeForm.css';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<Item>) => Promise<void>;
  isLoading: boolean;
  productTypeId: number;
  item?: Item;
}

const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  productTypeId,
  item
}) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [isSold, setIsSold] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setSerialNumber(item.serial_number);
      setIsSold(item.is_sold);
    } else {
      setSerialNumber('');
      setIsSold(false);
    }
    setError('');
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serialNumber.trim()) {
      setError('Serial number is required');
      return;
    }
    
    try {
      await onSubmit({
        id: item?.id,
        product_type_id: productTypeId,
        serial_number: serialNumber.trim(),
        is_sold: isSold
      });
      
      onClose();
    } catch (err) {
      setError('Failed to save item. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
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
            <label htmlFor="serialNumber">
              Serial Number <span className="required">*</span>
            </label>
            <input
              id="serialNumber"
              type="text"
              className={error ? 'input-error' : ''}
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              disabled={isLoading}
              placeholder="Enter item serial number"
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="isSold"
              type="checkbox"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              disabled={isLoading}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            <label htmlFor="isSold" style={{ marginBottom: 0 }}>
              Mark as sold
            </label>
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
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (item ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm; 