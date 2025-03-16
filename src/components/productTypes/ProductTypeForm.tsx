import React, { useState, useEffect } from 'react';
import '../../styles/components/ProductTypeForm.css';
import Button from '../common/Button';
import { ProductType } from '../../types/productType';



interface ProductTypeFormProps {
  productType?: ProductType;
  onSubmit: (productType: ProductType, image: File | null) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading: boolean;
}

const ProductTypeForm: React.FC<ProductTypeFormProps> = ({
  productType,
  onSubmit,
  onCancel,
  isOpen,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productType) {
      setName(productType.name || '');
      setDescription(productType.description || '');
      setImagePreview(productType.image_url || null);
    } else {
      setName('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [productType, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData: ProductType = {
      ...(productType?.id ? { id: productType.id } : {}),
      name,
      description,
      current_stocks: productType?.current_stocks || 0,
      image_path: productType?.image_path || null,
      image_url: productType?.image_url || null,
    };
    
    await onSubmit(formData, image);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(productType?.image_url || null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {productType?.id ? 'Edit Product Type' : 'Add Product Type'}
          </h2>
          <button className="modal-close" onClick={onCancel}>
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
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'input-error' : ''}
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    disabled={isLoading}
                  >
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
              )}
              {!imagePreview && (
                <div className="image-upload">
                  <label htmlFor="image-input" className="image-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Upload Image</span>
                  </label>
                  <input
                    type="file"
                    id="image-input"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={isLoading}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={onCancel}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (productType?.id ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductTypeForm; 