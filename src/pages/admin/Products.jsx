import React, { useState, useMemo } from "react";
import { useCrm } from "../../context/crmContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Toast from "../../components/common/Toast";

const CATEGORIES = ["All", "Electronics", "Furniture", "Accessories", "Software"];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useCrm();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    sku: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState("");

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Form open handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      sku: "",
      description: "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku || "",
      description: product.description || "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Product name is required.";
    }

    if (formData.price === "" || isNaN(formData.price) || Number(formData.price) < 0) {
      errors.price = "Valid price is required (>= 0).";
    }

    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = "Valid stock count is required (>= 0).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setToastMessage(`Product "${formData.name}" updated successfully.`);
    } else {
      const created = addProduct(payload);
      setToastMessage(`Product "${created.name}" created successfully.`);
    }

    setIsFormOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id);
    setToastMessage(`Product "${deletingProduct.name}" removed from catalog.`);
    setDeletingProduct(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Products Inventory
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage SKU listings, unit prices, live stock counts, and categories.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          + Add Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name, SKU, ID..."
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
                <th className="py-3 px-4">Product Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                      No products found
                    </p>
                    <p className="text-xs">Try adjusting your search query or category filter.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  const statusLabel = isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? "Low Stock"
                    : "In Stock";

                  return (
                    <tr key={product.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {product.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-900 dark:text-white">{product.name}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">SKU: {product.sku}</p>
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
                        <span className={`font-semibold ${isOutOfStock ? "text-rose-500" : isLowStock ? "text-amber-500" : "text-neutral-700 dark:text-neutral-300"}`}>
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
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingProduct(product)}
                            title="View Product"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {editingProduct ? `Edit Product (${editingProduct.id})` : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ergonomic Keyboard Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.name ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                  }`}
                />
                {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Software">Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ELEC-KB-900"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="299.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.price ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  />
                  {formErrors.price && <p className="text-[11px] text-rose-500 mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.stock ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  />
                  {formErrors.stock && <p className="text-[11px] text-rose-500 mt-1">{formErrors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Features, hardware specs..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Product Details</h3>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xl flex items-center justify-center">
                📦
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{viewingProduct.name}</h4>
                <p className="text-xs text-neutral-400">{viewingProduct.category} • SKU: {viewingProduct.sku}</p>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  ${Number(viewingProduct.price).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3 mb-5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">Product ID</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{viewingProduct.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">Stock Units</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{viewingProduct.stock} in stock</span>
                </div>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Description</span>
                <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  {viewingProduct.description || "Standard catalog product."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const prod = viewingProduct;
                  setViewingProduct(null);
                  handleOpenEditModal(prod);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        title="Delete Product?"
        message={`Are you sure you want to remove "${deletingProduct?.name}" (${deletingProduct?.id}) from catalog?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProduct(null)}
      />

      {/* TOAST FEEDBACK */}
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage("")} />
    </div>
  );
}
