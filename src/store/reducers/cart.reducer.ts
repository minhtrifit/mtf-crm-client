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
  total: number;
}

const initialState: CartState = {
  isOpenModal: false,
  items: [],
  total: 0,
};

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleCartModal, (state) => {
      state.isOpenModal = !state.isOpenModal;
    })

    .addCase(setCart, (state, action) => {
      state.items = action.payload;
      state.total = calcTotal(state.items);
    })

    .addCase(addToCart, (state, action) => {
      const existing = state.items.find((item) => item.product.id === action.payload.product.id);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.total = calcTotal(state.items);
    })

    .addCase(updateCartQuantity, (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
        state.total = calcTotal(state.items);
        return;
      }

      const item = state.items.find((item) => item.product.id === productId);

      if (item) {
        item.quantity = quantity;
      }

      state.total = calcTotal(state.items);
    })

    .addCase(removeFromCart, (state, action) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      state.total = calcTotal(state.items);
    })

    .addCase(clearCart, (state) => {
      state.items = [];
      state.total = 0;
    });
});

export default cartReducer;
