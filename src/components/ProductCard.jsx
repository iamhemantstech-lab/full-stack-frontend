import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = memo(function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div className="group p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-md transition-all">
      <div className="space-y-3">
        {product.image && (
          <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 relative">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              decoding="async"
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
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
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
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
