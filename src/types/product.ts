import { UserType } from './auth';
import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  imagesUrl: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Category;
  ratingAvg: number;
  ratingCount: number;
  soldCount: number;
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

export interface ProductReviewPayload {
  rating: number;
  comment: string;
  imagesUrl: string[];
  productId: string;
}

export interface CommentType {
  id: string;
  rating: number;
  comment: string;
  imagesUrl: string[];
  createdAt: string;
  userId: string;
  user: UserType;
}

export interface ProductReview {
  ratingAvg: number;
  ratingCount: number;
  ratingStats: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  comments: CommentType[];
}

export interface SearchKeyword {
  id: string;
  title: string;
  count: string;
  createdAt: string;
}

export interface SearchKeywordPayload {
  title: string;
}
