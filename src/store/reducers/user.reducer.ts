import axiosInstance from '@/+core/api/api.instance';
import Cookies from 'js-cookie';
import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';

import { FulfilledAction, PendingAction, RejectedAction } from '@/types/reduxthunk.type';
import { UserType } from '@/types/auth';

import {
  clearUser,
  setUser,
  toggleSidebar,
  setSidebar,
  toggleWebsiteModal,
  toggleMenuDrawer,
} from '../actions/user.action';

const APP_KEY = import.meta.env.VITE_APP_KEY;

// Interface declair
interface UserState {
  isLoading: boolean;
  isError: boolean;
  isOpenSidebar: boolean;
  isOpenWebsiteModal: boolean;
  user: UserType | null;
  isOpenMenuDrawer: boolean;
}

// createAsyncThunk middleware
export const createNewUser = createAsyncThunk(
  'users/createNewUser',
  async (payload: UserType, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users', {
        ...payload,
      });

      return response.data;
    } catch (error: any) {
      if (error.name === 'AxiosError') {
        return thunkAPI.rejectWithValue({
          message: 'Create new user failed',
        });
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// InitialState value
const initialState: UserState = {
  isLoading: false,
  isError: false,
  isOpenSidebar: true,
  isOpenWebsiteModal: false,
  user: null,
  isOpenMenuDrawer: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleMenuDrawer, (state) => {
      state.isOpenMenuDrawer = !state.isOpenMenuDrawer;
    })

    .addCase(toggleSidebar, (state, _) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    })

    .addCase(toggleWebsiteModal, (state, _) => {
      state.isOpenWebsiteModal = !state.isOpenWebsiteModal;
    })

    .addCase(setSidebar, (state, action) => {
      const value: boolean = action.payload;

      state.isOpenSidebar = value;
    })

    .addCase(setUser, (state, action) => {
      const payload = action?.payload;
      state.user = payload;
    })

    .addCase(clearUser, (state, _) => {
      Cookies.remove(APP_KEY); // Clear cookies

      state.user = null;
    })

    .addMatcher(
      (action): action is PendingAction => action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true;
      },
    )

    .addMatcher(
      (action): action is FulfilledAction => action.type.endsWith('/fulfilled'),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      },
    )

    .addMatcher(
      (action): action is RejectedAction => action.type.endsWith('/rejected'),
      (state) => {
        state.isLoading = false;
        state.isError = true;
      },
    );
});

export default userReducer;
