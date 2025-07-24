import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";

let store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
