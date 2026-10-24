import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectProductStatus,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // If page is refreshed directly at /products/:id, fetch products if not already loaded
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Find product matching current URL parameter
  const product = products.find((p) => String(p.id) === String(id));

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  if (status === "loading" && !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-neutral-500">
          Loading product details for #{id}...
        </p>
      </div>
    );
  }

  if (!product && status !== "loading") {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl">
          🔍
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Product Not Found
        </h2>
        <p className="text-xs text-neutral-500">
          We could not find a product with ID{" "}
          <span className="font-mono font-bold text-indigo-500">{id}</span>.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          ← Return to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      <nav className="flex items-center gap-2 text-xs text-neutral-400">
        <Link
          to="/"
          className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      <div>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 text-center space-y-4">
          <div className="w-28 h-28 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl shadow-inner">
            {product.category === "Electronics"
              ? "🎧"
              : product.category === "Groceries"
                ? "☕"
                : "✨"}
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {product.category}
            </span>
            <p className="text-[11px] text-neutral-400 pt-2">
              SKU: PROD-{String(product.id).padStart(4, "0")}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                ● In Stock & Ready to Ship
              </span>
              <span className="text-xs font-semibold text-amber-500">
                ⭐ {product.rating} / 5.0 Rating
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                ${(product.price * 1.25).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2">
              Premium tier quality with industry leading performance. Built with
              durable eco-friendly materials and engineered for everyday
              comfort, efficiency, and reliability.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-neutral-900 dark:text-white min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>🛒</span>
                <span>
                  Add {quantity} to Cart ($
                  {(product.price * quantity).toFixed(2)})
                </span>
              </button>
            </div>

            {addedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center animate-fade-in">
                ✓ Added to cart successfully!
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <p className="text-[10px] text-neutral-400">Shipping</p>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Free Next Day
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <p className="text-[10px] text-neutral-400">Warranty</p>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                2-Year Official
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <p className="text-[10px] text-neutral-400">Returns</p>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                30-Day Hassle Free
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
