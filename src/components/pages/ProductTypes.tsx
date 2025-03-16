import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/pages/PageStyles.css';
import Table from '../common/Table';
import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import ProductTypeForm from '../productTypes/ProductTypeForm';
import ConfirmationModal from '../common/ConfirmationModal';
import { ProductType } from '../../types/productType';
import * as productTypeService from '../../services/productTypeService';

const ProductTypes: React.FC = () => {
  const navigate = useNavigate();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProductTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productTypeService.getProductTypes(currentPage, searchTerm);
      setProductTypes(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        perPage: response.data.pagination.per_page,
        currentPage: response.data.pagination.current_page,
        lastPage: response.data.pagination.last_page,
      });
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Failed to load product types. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddClick = () => {
    setSelectedProductType(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (productType: ProductType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedProductType(productType);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (productType: ProductType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setProductTypeToDelete(productType);
    setIsDeleteModalOpen(true);
  };

  const handleRowClick = (productType: ProductType) => {
    if (productType.id) {
      navigate(`/dashboard/product-types/${productType.id}/items`);
    }
  };

  const handleFormSubmit = async (productType: ProductType, image: File | null) => {
    setIsSubmitting(true);
    try {
      if (productType.id) {
        await productTypeService.updateProductType(
          productType.id,
          {
            name: productType.name,
            description: productType.description,
          },
          image
        );
        toast.success('Product type updated successfully');
      } else {
        await productTypeService.createProductType(
          {
            name: productType.name,
            description: productType.description,
            current_stocks: 0,
            image_path: null,
            image_url: null,
          },
          image
        );
        toast.success('Product type created successfully');
      }
      setIsFormOpen(false);
      fetchProductTypes();
    } catch (error) {
      console.error('Error saving product type:', error);
      toast.error('Failed to save product type. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productTypeToDelete || productTypeToDelete.id === undefined) return;
    
    setIsDeleting(true);
    try {
      await productTypeService.deleteProductType(productTypeToDelete.id);
      toast.success('Product type deleted successfully');
      setIsDeleteModalOpen(false);
      
      if (productTypes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProductTypes();
      }
    } catch (error) {
      console.error('Error deleting product type:', error);
      toast.error('Failed to delete product type. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { header: 'ID', key: 'id', width: '80px' },
    { 
      header: 'Image', 
      key: 'image_path', 
      width: '90px',
      render: (item: ProductType) => (
        <div className="product-image-cell">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="product-thumbnail" 
            />
          ) : (
            <div className="no-image">
              No Image
            </div>
          )}
        </div>
      ),
    },
    { 
      header: 'Product Type Name', 
      key: 'name',
      render: (item: ProductType) => (
        <div className="product-name-cell">
          <div className="product-name">{item.name}</div>
        </div>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      width: '250px',
      render: (item: ProductType) => (
        <div className="product-description-cell">
          <div className="product-description">{item.description}</div>
        </div>
      ),
    },
    { 
      header: 'Count', 
      key: 'current_stocks',
      width: '100px',
      render: (item: ProductType) => (
        <span className="stock-count">{item.current_stocks}</span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '150px',
      render: (item: ProductType) => (
        <div className="action-buttons">
          <button
            onClick={(e) => handleEditClick(item, e)}
            className="action-button edit"
            title="Edit"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => handleDeleteClick(item, e)}
            className="action-button delete"
            title="Delete"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#dc2626" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-content">
      <div className="product-types-header">
        <h1 className="page-title">Product Types</h1>
        <div className="product-types-controls">
          <div className="search-wrapper">
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name..."
            />
          </div>
          <div className="button-group">
            <Button
              variant="primary"
              onClick={handleAddClick}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
            >
              Add Product Type
            </Button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={productTypes}
        pagination={pagination}
        onPageChange={handlePageChange}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No product types found. Create your first one!"
        onRowClick={handleRowClick}
      />

      <ProductTypeForm
        productType={selectedProductType}
        isOpen={isFormOpen}
        isLoading={isSubmitting}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Product Type"
        message={`Are you sure you want to delete "${productTypeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default ProductTypes; 