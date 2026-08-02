import { Product } from './product';

export interface CartType {
  id: string;
  userId: string;
  items: CartItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemQuantityPayload {
  cartItemId: string;
  quantity: number;
}
