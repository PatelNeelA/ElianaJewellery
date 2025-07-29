// store/CartSlice.js (MODIFIED)
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    favorites: [],
  },
  reducers: {
    add(state, action) {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        // If item already exists, just increment its quantity
        existingItem.quantity += 1;
      } else {
        // If item is new, add it with quantity 1
        // Ensure the added item has a quantity property initialized to 1
        const newItem = { ...action.payload, quantity: 1 };
        state.items.push(newItem);
      }
    },
    remove(state, action) {
      // action.payload is the _id of the item to remove
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    increment(state, action) {
      // action.payload is the _id of the item to increment
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrement(state, action) {
      // action.payload is the _id of the item to decrement
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        // Only decrement if quantity > 1
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        // Optional: Remove item from cart if quantity becomes 0 after decrement
        state.items = state.items.filter(
          (cartItem) => cartItem._id !== action.payload
        );
      }
    },
    addToFavorites(state, action) {
      // Ensure favorite items are unique based on _id
      const existingFavorite = state.favorites.find(
        (item) => item._id === action.payload._id
      );
      if (!existingFavorite) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites(state, action) {
      // action.payload is the _id of the item to remove from favorites
      state.favorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );
    },
    // Optional: A clear cart action
    clearCart(state) {
      state.items = [];
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
  clearCart, // Export if you add it
} = cartSlice.actions;

export default cartSlice.reducer;
