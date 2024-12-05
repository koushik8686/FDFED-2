// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './LikedReducer';

export const store = configureStore({
  reducer: {
    liked: wishlistReducer,

  },
});
