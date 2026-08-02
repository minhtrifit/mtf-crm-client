import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axiosInstance from '@/+core/api/api.instance';
import {
  setCart,
  updateCartQuantity,
  removeFromCart,
  toggleCartModal,
} from '../actions/cart.action';
import { CartItem } from '@/types';
import { AddToCartPayload, CartItemType } from '@/types/cart';

export const getCart = createAsyncThunk('cart/getCart', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error: any) {
    if (error.name === 'AxiosError') {
      return thunkAPI.rejectWithValue({
        message: 'Get cart failed',
      });
    }
    return thunkAPI.rejectWithValue(error);
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: AddToCartPayload, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/cart/add', {
        productId: payload.productId,
        quantity: payload.quantity,
      });
      return response.data;
    } catch (error: any) {
      if (error.name === 'AxiosError') {
        return thunkAPI.rejectWithValue({
          message: 'Add item to cart failed',
        });
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/cart/clear');
    return response.data;
  } catch (error: any) {
    if (error.name === 'AxiosError') {
      return thunkAPI.rejectWithValue({
        message: 'Clear cart failed',
      });
    }
    return thunkAPI.rejectWithValue(error);
  }
});

interface CartState {
  isLoadingCart: boolean;
  isAddingToCart: boolean;
  isClearingCart: boolean;
  isOpenModal: boolean;
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  isLoadingCart: false,
  isAddingToCart: false,
  isClearingCart: false,
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

    .addCase(addToCart.fulfilled, (state, action) => {
      state.isAddingToCart = false;
      if (!action.payload) return;
      console.log(action.payload);
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

    .addCase(clearCart.pending, (state) => {
      state.isClearingCart = true;
    })

    .addCase(clearCart.fulfilled, (state) => {
      state.isClearingCart = false;
      state.items = [];
      state.total = 0;
    })

    .addCase(clearCart.rejected, (state) => {
      state.isClearingCart = false;
    })

    .addCase(getCart.pending, (state) => {
      state.isLoadingCart = true;
    })

    .addCase(getCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      if (!action.payload) return;
      const data = action.payload;
      const items = data.data.items.map((item: CartItemType) => {
        return {
          product: item.product,
          quantity: item.quantity,
        };
      });
      state.items = items;
      state.total = calcTotal(items);
    })

    .addCase(getCart.rejected, (state) => {
      state.isLoadingCart = false;
    });
});

export default cartReducer;
