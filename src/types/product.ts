import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: string;
  imagesUrl: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  imagesUrl: string[];
  description: string;
  categoryId: string;
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  sku?: string;
  price?: number;
  stock?: number;
  imagesUrl?: string[];
  description?: string;
  isActive?: boolean;
  categoryId?: string;
}
