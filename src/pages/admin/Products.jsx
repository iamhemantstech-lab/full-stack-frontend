import React, { useState, useMemo, useEffect } from "react";
import { useCrm } from "../../context/crmContext";
import { apiClient } from "../../services/apiClient";
import Pagination from "../../components/common/Pagination";

const CATEGORIES = ["All", "Electronics", "Furniture", "Accessories", "Lifestyle", "Software"];

export default function Products() {
  const { products: localProducts } = useCrm();

  // State
  const [products, setProducts] = useState(localProducts || []);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewingProduct, setViewingProduct] = useState(null);

  // Pagination State (8 products per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Fetch products directly from MongoDB backend API
  useEffect(() => {
    let isMounted = true;
    const fetchProductsFromDb = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/products");
        const backendProducts = response?.data?.data?.products || response?.data?.data;
        if (isMounted && Array.isArray(backendProducts) && backendProducts.length > 0) {
          const mapped = backendProducts.map((p) => ({
            id: p._id || p.id,
            name: p.title || p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            status: p.status,
            sku: p.sku,
            rating: p.rating || 4.5,
            description: p.description,
            image: p.image,
          }));
          setProducts(mapped);
        } else if (isMounted && localProducts?.length > 0) {
          setProducts(localProducts);
        }
      } catch (err) {
        console.warn("Using local products fallback:", err.message);
        if (isMounted && localProducts?.length > 0) {
          setProducts(localProducts);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductsFromDb();
    return () => {
      isMounted = false;
    };
  }, [localProducts]);

  // Filtered Products (Search & Category)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = p.name || p.title || "";
      const sku = p.sku || "";
      const id = String(p.id || "");

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Reset page to 1 when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Products Inventory
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Read-only live catalog synchronized directly with MongoDB database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MongoDB Synced ({products.length} Items)
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products by title, SKU, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto self-start sm:self-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 uppercase font-semibold">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Title & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs font-semibold text-neutral-500">Loading products from MongoDB...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                      No products found
                    </p>
                    <p className="text-xs text-neutral-500">
                      Try clearing search filters or add products directly to MongoDB.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  const statusLabel = isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? "Low Stock"
                    : "In Stock";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {String(product.id).slice(-6)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm flex items-center justify-center shrink-0">
                              📦
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 dark:text-white truncate max-w-[240px]">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono">
                              SKU: {product.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-[11px]">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            isOutOfStock
                              ? "text-rose-500"
                              : isLowStock
                              ? "text-amber-500"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOutOfStock
                              ? "bg-rose-500/15 text-rose-500"
                              : isLowStock
                              ? "bg-amber-500/15 text-amber-500"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingProduct(product)}
                          title="View Product Details"
                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold transition-colors text-xs"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Pagination */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          className="px-2"
        />
      )}

      {/* VIEW PRODUCT DETAILS MODAL */}
      {viewingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setViewingProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Product Details
              </h3>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              {viewingProduct.image ? (
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xl flex items-center justify-center shrink-0">
                  📦
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {viewingProduct.name}
                </h4>
                <p className="text-xs text-neutral-400">
                  {viewingProduct.category} • SKU: {viewingProduct.sku || "N/A"}
                </p>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  ${Number(viewingProduct.price).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3 mb-5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">
                    Product ID
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                    {viewingProduct.id}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">
                    Stock Units
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {viewingProduct.stock} units
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">
                  Rating
                </span>
                <span className="font-semibold text-amber-500">
                  ⭐ {viewingProduct.rating || 4.5} / 5.0
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">
                  Description
                </span>
                <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  {viewingProduct.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="w-full py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
