import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/common/Pagination";
import {
  fetchProducts,
  clearProductCache,
  selectAllProducts,
  selectProductTotal,
  selectProductStatus,
  selectProductError,
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

const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Accessories",
  "Lifestyle",
  "Groceries",
];

const LIMIT = 5;

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const products = useSelector(selectAllProducts);
  const total = useSelector(selectProductTotal);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);

  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  // Local Search & Pagination State
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input changes by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1); // Reset to page 1 on new search query
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const getProductList = async (search, page) => {
    const offset = (page - 1) * LIMIT;
    await dispatch(fetchProducts({ search, limit: LIMIT, offset }));
  };

  // Fetch real data from backend using { search, limit = 5, offset = 0 } query params
  useEffect(() => {
    getProductList(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage]);

  const totalPages = Math.ceil(total / LIMIT) || 1;

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSearchInput("");
    } else {
      setSearchInput(category);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real MongoDB backend data with server-side search and pagination
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ● {total} Total Products
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => {
              dispatch(clearProductCache());
              getProductList(debouncedSearch, currentPage);
            }}
            title="Clear cache & reload fresh data from database"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors shadow-sm"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full py-2.5 pl-9 pr-8 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
            placeholder="Search by title, description, category, or SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto shadow-sm">
          {CATEGORIES.map((cat) => {
            const isActive =
              (cat === "All" && !searchInput) ||
              searchInput.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Products + Cart Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Products List & Pagination */}
        <section className="lg:col-span-2 space-y-6">
          {/* Loading State */}
          {status === "loading" && (
            <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-3">
              <div className="w-8 h-8 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Fetching products from database (search: "
                {debouncedSearch || "all"}", limit: {LIMIT}, offset:{" "}
                {(currentPage - 1) * LIMIT})...
              </p>
            </div>
          )}

          {/* Failed State */}
          {status === "failed" && (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl space-y-3">
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                {error || "Failed to load products from database"}
              </p>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    fetchProducts({
                      search: debouncedSearch,
                      limit: LIMIT,
                      offset: (currentPage - 1) * LIMIT,
                    }),
                  )
                }
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {status === "succeeded" && products.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">🔍</span>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No products found
              </p>
              <p className="text-xs text-neutral-500">
                No items matched "{debouncedSearch}". Try a different keyword or
                category.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Succeeded State: Products Cards */}
          {status === "succeeded" && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      {product.image && (
                        <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 relative">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/60 text-white backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                          <span>{product.sku}</span>
                          <span className="text-amber-500 font-semibold">
                            ⭐ {product.rating}
                          </span>
                        </div>
                        <Link
                          to={`/products/${product.id}`}
                          className="block text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {product.title}
                        </Link>
                        {product.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <p className="text-[10px] text-neutral-400">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          Details →
                        </button>
                        <button
                          type="button"
                          disabled={product.stock <= 0}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-colors"
                          onClick={() => dispatch(addToCart(product))}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Server-Side Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={LIMIT}
                onPageChange={(page) => setCurrentPage(page)}
                className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800"
              />
            </>
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
              Your cart is empty. Add products to test cart flow.
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
                        ${Number(item.price).toFixed(2)} each
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
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
                        type="button"
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
                        type="button"
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
                    ${Number(totalPrice).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
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
