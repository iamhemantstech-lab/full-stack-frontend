import { createSelector, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload.product
        ? action.payload
        : { product: action.payload, quantity: 1 };
      const existingItem = state.items.find((o) => o.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((o) => o.id !== id);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((o) => o.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((o) => o.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart(state, action) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotalPrice = createSelector([selectCartItems], (items) =>
  items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2),
);

export default cartSlice.reducer;
