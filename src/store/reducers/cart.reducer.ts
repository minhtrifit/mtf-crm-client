import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axiosInstance from '@/+core/api/api.instance';
import { setCart, removeFromCart, toggleCartModal, clearLocalCart } from '../actions/cart.action';
import { CartItem } from '@/types';
import { AddToCartPayload, CartItemType, UpdateCartItemQuantityPayload } from '@/types/cart';

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

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (payload: UpdateCartItemQuantityPayload, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/cart/update-item-quantity', {
        cartItemId: payload.cartItemId,
        quantity: payload.quantity,
      });
      return response.data;
    } catch (error: any) {
      if (error.name === 'AxiosError') {
        return thunkAPI.rejectWithValue({
          message: 'Update cart item failed',
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

    .addCase(clearLocalCart, (state) => {
      state.items = [];
      state.total = 0;
    })

    .addCase(addToCart.fulfilled, (state, action) => {
      state.isAddingToCart = false;
      if (!action.payload) return;
      state.total = calcTotal(state.items);
    })

    .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      if (!action.payload) return;
      const data = action.payload;
      const items = data.data.items.map((item: CartItemType) => {
        return {
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        };
      });
      state.items = items;
      state.total = calcTotal(items);
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
          id: item.id,
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
