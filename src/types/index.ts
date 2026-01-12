import { Product } from './product';

export interface PagingType {
  current_page: number;
  total_item: number;
  total_page: number;
  total: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
