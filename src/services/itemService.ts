import { ProductType } from '../types/productType';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Item {
  id?: number;
  product_type_id: number;
  serial_number: string;
  is_sold: boolean;
  created_at?: string;
  updated_at?: string;
  product_type?: ProductType;
}

export interface ItemResponse {
  success: boolean;
  message: string;
  data: Item;
}

export interface ItemListResponse {
  success: boolean;
  message: string;
  data: {
    data: Item[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export const getItems = async (
  productTypeId: number,
  page: number = 1,
  search: string = ''
): Promise<ItemListResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const url = new URL(`${API_URL}/items`);
  url.searchParams.append('product_type_id', productTypeId.toString());
  url.searchParams.append('page', page.toString());
  
  if (search) {
    url.searchParams.append('search', search);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch items');
  }

  return await response.json();
};

export const createItem = async (item: {
  product_type_id: number;
  serial_number: string;
  is_sold: boolean;
}): Promise<ItemResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create item');
  }

  return await response.json();
};

export const updateItem = async (
  id: number,
  item: Partial<Item>
): Promise<ItemResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update item');
  }

  return await response.json();
};

export const deleteItem = async (id: number): Promise<ItemResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete item');
  }

  return await response.json();
};

export const toggleItemSold = async (id: number): Promise<ItemResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/items/${id}/toggle-sold`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to toggle item sold status');
  }

  return await response.json();
};

export interface BatchCreateItemsRequest {
  product_type_id: number;
  serial_numbers: string[];
}

export interface BatchCreateItemsResponse {
  success: boolean;
  message: string;
  data: {
    created: number;
    items: Item[];
  };
}

export const batchCreateItems = async (
  request: BatchCreateItemsRequest
): Promise<BatchCreateItemsResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/items/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to batch create items');
  }

  return await response.json();
}; 