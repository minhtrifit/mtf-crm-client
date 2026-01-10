import { createReducer } from '@reduxjs/toolkit';
import {
  setCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  toggleCartModal,
} from '../actions/cart.action';
import { CartItem } from '@/types';

interface CartState {
  isOpenModal: boolean;
  items: CartItem[];
}

const initialState: CartState = {
  isOpenModal: false,
  items: [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleCartModal, (state, _) => {
      state.isOpenModal = !state.isOpenModal;
    })

    .addCase(setCart, (state, action) => {
      state.items = action.payload;
    })

    .addCase(addToCart, (state, action) => {
      const existing = state.items.find((item) => item.productId === action.payload.productId);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    })

    .addCase(updateCartQuantity, (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    })

    .addCase(removeFromCart, (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    })

    .addCase(clearCart, (state) => {
      state.items = [];
    });
});

export default cartReducer;
