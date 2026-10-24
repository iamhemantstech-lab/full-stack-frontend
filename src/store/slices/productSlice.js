import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 129.5,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Organic Fair-Trade Coffee Beans",
    category: "Groceries",
    price: 18.0,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Stainless Steel Insulated Water Bottle",
    category: "Lifestyle",
    price: 34.99,
    rating: 4.6,
  },
  {
    id: 5,
    title: "Ultra-Wide 4K Gaming Monitor",
    category: "Electronics",
    price: 449.0,
    rating: 4.9,
  },
  {
    id: 6,
    title: "Handcrafted Ceramic Mug",
    category: "Lifestyle",
    price: 22.0,
    rating: 4.5,
  },
];

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((res) => setTimeout(res, 600));
      return MOCK_PRODUCTS;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    searchTerm: "",
    selectedCategory: "All",
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setSelectedCategory } = productSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectProductStatus = (state) => state.products.status;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectSelectedCategory = (state) =>
  state.products.selectedCategory;

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSearchTerm, selectSelectedCategory],
  (items, searchTerm, category) => {
    return items.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  },
);

export default productSlice.reducer;
