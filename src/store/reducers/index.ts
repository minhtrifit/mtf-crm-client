import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user.reducer';
import cartReducer from './cart.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['carts'],
};

export const rootReducer = combineReducers({
  users: userReducer,
  carts: cartReducer,
});

export default persistReducer(persistConfig, rootReducer);
