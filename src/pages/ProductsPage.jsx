import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectFilteredProducts,
  selectProductStatus,
  selectSearchTerm,
  selectSelectedCategory,
  setSearchTerm,
  setSelectedCategory,
} from "../store/slices/productSlice";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from "../store/slices/cartSlice";

const CATEGORIES = ["All", "Electronics", "Groceries", "Lifestyle"];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductStatus);
  const searchTerm = useSelector(selectSearchTerm);
  const selectedCategory = useSelector(selectSelectedCategory);

  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  // Trigger Async Thunk on mount if idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div className="space-y-1.5 text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          ⚡ Redux Toolkit Architecture Demo
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Enterprise Products & Cart Store
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Demonstrating createSlice, createAsyncThunk, and memoized
          createSelector
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            className="w-full py-2 pl-9 pr-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="🔍 Search products by name..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Products Grid */}
        <section className="lg:col-span-2">
          {status === "loading" && (
            <div className="text-center py-16">
              <p className="text-sm font-semibold text-indigo-600 animate-pulse">
                Loading products via createAsyncThunk...
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center py-16 text-rose-500 text-sm font-semibold">
              Failed to load products.
            </div>
          )}

          {status === "succeeded" && products.length === 0 && (
            <div className="text-center py-16 text-neutral-400 text-sm">
              No products match your filter criteria.
            </div>
          )}

          {status === "succeeded" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {product.category}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="block text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-amber-500 font-semibold">
                      ⭐ {product.rating} / 5.0
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border ..."
                      >
                        Details →
                      </button>
                      {/* <Link
                        to={`/products/${product.id}`}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        Details →
                      </Link> */}
                      <button
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                        onClick={() => dispatch(addToCart(product))}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Redux Cart Drawer */}
        <aside className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              🛒 Shopping Cart
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              {totalQuantity} items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8 italic">
              Your cart is empty. Add products to test Redux state updates.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="pt-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-neutral-400">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-200"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-200"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="text-rose-500 hover:text-rose-700 p-1 text-xs"
                        title="Remove"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-neutral-900 dark:text-white">
                  <span>Grand Total:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${totalPrice}
                  </span>
                </div>

                <button
                  className="w-full py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
