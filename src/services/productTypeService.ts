import { ProductType } from '../types/productType';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ProductTypeResponse {
  success: boolean;
  message: string;
  data: ProductType;
}

export interface ProductTypeListResponse {
  success: boolean;
  message: string;
  data: {
    data: ProductType[];
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

export const getProductTypes = async (
  page: number = 1,
  search: string = ''
): Promise<ProductTypeListResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const url = new URL(`${API_URL}/product-types`);
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
    throw new Error(errorData.message || 'Failed to fetch product types');
  }

  return await response.json();
};

export const getProductType = async (id: number): Promise<ProductTypeResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/product-types/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch product type');
  }

  return await response.json();
};

export const createProductType = async (
  productType: Omit<ProductType, 'id'>,
  image: File | null
): Promise<ProductTypeResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('name', productType.name);
  formData.append('description', productType.description);
  
  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${API_URL}/product-types`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create product type');
  }

  return await response.json();
};

export const updateProductType = async (
  id: number,
  productType: Partial<ProductType>,
  image: File | null
): Promise<ProductTypeResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('_method', 'PUT'); 
  if (productType.name !== undefined) {
    formData.append('name', productType.name);
  }
  
  if (productType.description !== undefined) {
    formData.append('description', productType.description);
  }
  
  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${API_URL}/product-types/${id}`, {
    method: 'POST', 
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product type');
  }

  return await response.json();
};

export const deleteProductType = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/product-types/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product type');
    } catch (e) {
      throw new Error('Failed to delete product type');
    }
  }
  
  return;
}; 