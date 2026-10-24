import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authSlice from "./slices/authSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
