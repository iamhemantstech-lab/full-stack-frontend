import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../services/apiClient";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { search = "", limit = 5, offset = 0 } = {},
    { rejectWithValue, getState },
  ) => {
    try {
      const cacheKey = `${search}_${limit}_${offset}`;
      const { products: productState } = getState();

      // Return immediately if this exact query is already cached
      if (productState.cache && productState.cache[cacheKey]) {
        return productState.cache[cacheKey];
      }

      const response = await apiClient.get("/products", {
        params: { search, limit, offset },
      });

      const data = response?.data?.data;
      const rawProducts = data?.products || [];
      const total = data?.pagination?.total ?? rawProducts.length;

      // Normalize MongoDB fields so each item has id, title, price, image, etc.
      const products = rawProducts.map((item) => ({
        id: String(item._id || item.id),
        _id: String(item._id || item.id),
        title: item.title || item.name || "Untitled Product",
        description: item.description || "",
        price: Number(item.price) || 0,
        category: item.category || "General",
        image:
          item.image ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        rating: Number(item.rating) || 4.5,
        stock: Number(item.stock) || 0,
        status: item.status || (item.stock > 0 ? "In Stock" : "Out of Stock"),
        sku:
          item.sku ||
          `SKU-${String(item._id || "")
            .slice(-6)
            .toUpperCase()}`,
      }));

      return { products, total, cacheKey };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products from backend database",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    cache: {},
    status: "idle",
    error: null,
  },
  reducers: {
    clearProductCache(state) {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const { search = "", limit = 5, offset = 0 } = action.meta.arg || {};
        const cacheKey = `${search}_${limit}_${offset}`;

        // If data is in cache, display immediately without flashing loading state
        if (state.cache && state.cache[cacheKey]) {
          state.items = state.cache[cacheKey].products;
          state.total = state.cache[cacheKey].total;
          state.status = "succeeded";
        } else {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.total = action.payload.total;
        if (action.payload.cacheKey) {
          state.cache[action.payload.cacheKey] = {
            products: action.payload.products,
            total: action.payload.total,
            cacheKey: action.payload.cacheKey,
          };
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProductCache } = productSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductStatus = (state) => state.products.status;
export const selectProductTotal = (state) => state.products.total;
export const selectProductError = (state) => state.products.error;

export default productSlice.reducer;
