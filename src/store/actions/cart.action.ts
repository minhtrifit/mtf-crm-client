import { createAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

export const toggleCartModal = createAction('cart/toggleCartModal');
export const setCart = createAction<CartItem[]>('cart/setCart');
export const clearLocalCart = createAction('cart/clearLocalCart');
