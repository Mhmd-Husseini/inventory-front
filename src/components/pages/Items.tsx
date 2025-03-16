import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/pages/PageStyles.css';
import Table from '../common/Table';
import Button from '../common/Button';
import SearchInput from '../common/SearchInput';
import ConfirmationModal from '../common/ConfirmationModal';
import ItemForm from '../items/ItemForm';
import BatchItemForm from '../items/BatchItemForm';
import { 
  Item, 
  getItems, 
  createItem, 
  updateItem, 
  deleteItem, 
  toggleItemSold,
  batchCreateItems
} from '../../services/itemService';
import { getProductType } from '../../services/productTypeService';
import { ProductType } from '../../types/productType';

const Items: React.FC = () => {
  const { productTypeId } = useParams<{ productTypeId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [productType, setProductType] = useState<ProductType | null>(null);
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
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProductType = async () => {
      if (!productTypeId) return;
      
      try {
        const response = await getProductType(parseInt(productTypeId));
        setProductType(response.data);
      } catch (error) {
        console.error('Error fetching product type:', error);
        toast.error('Failed to load product type information.');
        navigate('/dashboard/product-types');
      }
    };
    
    fetchProductType();
  }, [productTypeId, navigate]);

  const fetchItems = useCallback(async () => {
    if (!productTypeId) return;
    
    setIsLoading(true);
    try {
      const response = await getItems(parseInt(productTypeId), currentPage, searchTerm);
      setItems(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        perPage: response.data.pagination.per_page,
        currentPage: response.data.pagination.current_page,
        lastPage: response.data.pagination.last_page,
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [productTypeId, currentPage, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleBackClick = () => {
    navigate('/dashboard/product-types');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddClick = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  const handleBatchAddClick = () => {
    setIsBatchFormOpen(true);
  };

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSoldChange = async (item: Item) => {
    try {
      const response = await toggleItemSold(item.id!);
      
      const updatedItem = response.data;
      setItems(prevItems => 
        prevItems.map(i => i.id === item.id ? updatedItem : i)
      );
      
      if (productType && productType.id) {
        const countChange = updatedItem.is_sold ? -1 : 1;
        setProductType({
          ...productType,
          current_stocks: (productType.current_stocks || 0) + countChange
        });
      }
      
      toast.success(`Item marked as ${updatedItem.is_sold ? 'sold' : 'available'}`);
    } catch (error) {
      console.error('Error updating item sold status:', error);
      toast.error('Failed to update item. Please try again.');
    }
  };

  const handleFormSubmit = async (formItem: Partial<Item>) => {
    if (!productTypeId) return;
    const productTypeIdNumber = parseInt(productTypeId);
    
    setIsSubmitting(true);
    try {
      if (formItem.id) {
        await updateItem(formItem.id, formItem);
        toast.success('Item updated successfully');
      } else {
        await createItem({
          product_type_id: productTypeIdNumber,
          serial_number: formItem.serial_number!,
          is_sold: formItem.is_sold || false
        });
        
        toast.success('Item added successfully');
        
        if (productType && !formItem.is_sold) {
          setProductType({
            ...productType,
            current_stocks: (productType.current_stocks || 0) + 1
          });
        }
      }
      
      setIsFormOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchSubmit = async (serialNumbers: string[]) => {
    if (!productTypeId) return;
    const productTypeIdNumber = parseInt(productTypeId);
    
    setIsBatchSubmitting(true);
    try {
      const response = await batchCreateItems({
        product_type_id: productTypeIdNumber,
        serial_numbers: serialNumbers
      });
      
      toast.success(`Successfully added ${response.data.created} items`);
      
      if (productType) {
        setProductType({
          ...productType,
          current_stocks: (productType.current_stocks || 0) + response.data.created
        });
      }
      
      fetchItems();
    } catch (error) {
      console.error('Error batch creating items:', error);
      toast.error('Failed to add items. Please try again.');
    } finally {
      setIsBatchSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || itemToDelete.id === undefined) return;
    
    setIsDeleting(true);
    try {
      await deleteItem(itemToDelete.id);
      
      if (productType && !itemToDelete.is_sold) {
        setProductType({
          ...productType,
          current_stocks: Math.max(0, (productType.current_stocks || 0) - 1)
        });
      }
      
      toast.success('Item deleted successfully');
      setIsDeleteModalOpen(false);
      
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { header: 'ID', key: 'id', width: '80px' },
    { 
      header: 'Serial Number', 
      key: 'serial_number',
      render: (item: Item) => (
        <div className="serial-number-cell">
          {item.serial_number}
        </div>
      ),
    },
    { 
      header: 'Sold', 
      key: 'is_sold',
      width: '100px',
      render: (item: Item) => (
        <div className="sold-checkbox-cell">
          <input
            type="checkbox"
            checked={item.is_sold}
            onChange={() => handleSoldChange(item)}
            className="sold-checkbox"
          />
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '150px',
      render: (item: Item) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEditClick(item)}
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
            onClick={() => handleDeleteClick(item)}
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
      <div className="items-header">
        <div className="items-title-section">
          <button 
            onClick={handleBackClick}
            className="back-button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Product Types
          </button>
          <h1 className="page-title">
            {productType ? productType.name : 'Loading...'} Items
            <span className="item-count">
              {!isLoading && `${pagination.total} items, ${productType?.current_stocks || 0} in stock`}
            </span>
          </h1>
        </div>
        <div className="items-controls">
          <div className="search-wrapper">
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by serial number..."
            />
          </div>
          <div className="button-group">
            <Button
              variant="secondary"
              onClick={handleBatchAddClick}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            >
              Batch Add
            </Button>
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
              Add Item
            </Button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={items}
        pagination={pagination}
        onPageChange={handlePageChange}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage={`No items found for this product type. Click "Add Item" to create one.`}
      />

      {productTypeId && (
        <>
          <ItemForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
            productTypeId={parseInt(productTypeId)}
            item={selectedItem}
          />
          
          <BatchItemForm
            isOpen={isBatchFormOpen}
            onClose={() => setIsBatchFormOpen(false)}
            onSubmit={handleBatchSubmit}
            isLoading={isBatchSubmitting}
            productTypeId={parseInt(productTypeId)}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Item"
        message={`Are you sure you want to delete this item with serial number "${itemToDelete?.serial_number}"? This action cannot be undone.`}
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

export default Items; 