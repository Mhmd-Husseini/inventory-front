export interface ProductTypeResponse {
  id: number;
  user_id: number;
  name: string;
  description: string;
  current_stocks: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
} 

export interface ProductType {
  id?: number;
  name: string;
  description: string;
  current_stocks: number;
  image_path: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}