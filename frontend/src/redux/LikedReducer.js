// src/redux/wishlistSlice.js
import { createSlice  } from '@reduxjs/toolkit';
const wishlistSlice = createSlice({
  name: 'liked',
  initialState: [],
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const existingIndex = state.findIndex((wishlistItem) => wishlistItem._id === item._id);

      if (existingIndex >= 0) {
        state.splice(existingIndex, 1);
        console.log(`Item removed from wishlist:`, item);
      } else {
        state.push(item);
        console.log(`Item added to wishlist:`, item);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
