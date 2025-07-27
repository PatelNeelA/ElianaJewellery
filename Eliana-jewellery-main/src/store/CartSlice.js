import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    favorites: [], // Add favorites array to store favorite items
  },
  reducers: {
    add(state, action) {
      // Ensure the added item has a quantity property for cart operations
      const newItem = { ...action.payload, quantity: 1 };
      state.items.push(newItem);
    },
    remove(state, action) {
      // Use item._id for filtering
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    increment(state, action) {
      // Use item._id to find the item
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrement(state, action) {
      // Use item._id to find the item
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    addToFavorites(state, action) {
      state.favorites.push(action.payload);
    },
    removeFromFavorites(state, action) {
      // Use item._id for filtering
      state.favorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const {
  add,
  remove,
  increment,
  decrement,
  addToFavorites,
  removeFromFavorites,
} = cartSlice.actions;

export default cartSlice.reducer;
