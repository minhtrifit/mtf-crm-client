import { createAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

export const toggleCartModal = createAction('cart/toggleCartModal');
export const setCart = createAction<CartItem[]>('cart/setCart');
export const addToCart = createAction<CartItem>('cart/addToCart');
export const updateCartQuantity = createAction<{
  productId: string;
  quantity: number;
}>('cart/updateCartQuantity');
export const removeFromCart = createAction<string>('cart/removeFromCart');
export const clearCart = createAction('cart/clearCart');
