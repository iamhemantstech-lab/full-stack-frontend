import React, { useState, useMemo } from "react";
import { useCrm } from "../../context/crmContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Toast from "../../components/common/Toast";

const ORDER_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const { orders, customers, products, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useCrm();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: "",
    selectedProductIds: [],
    customAmount: "",
    paymentStatus: "Paid",
    orderStatus: "Processing",
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState("");

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || o.orderStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingOrder(null);
    setFormData({
      customerId: customers[0]?.id || "",
      selectedProductIds: [products[0]?.id || ""],
      customAmount: products[0]?.price?.toString() || "299.00",
      paymentStatus: "Paid",
      orderStatus: "Processing",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setFormData({
      customerId: order.customerId,
      selectedProductIds: order.items?.map((it) => it.productId) || [],
      customAmount: order.totalAmount.toString(),
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.customerId) {
      errors.customerId = "Please select a customer.";
    }

    if (
      formData.customAmount === "" ||
      isNaN(formData.customAmount) ||
      Number(formData.customAmount) <= 0
    ) {
      errors.customAmount = "Please enter a valid total amount (> 0).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedCust = customers.find((c) => c.id === formData.customerId) || {
      name: "Customer",
      email: "customer@example.com",
    };

    const parsedAmount = Number(formData.customAmount);

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        customerId: selectedCust.id,
        customerName: selectedCust.name,
        customerEmail: selectedCust.email,
        totalAmount: parsedAmount,
        paymentStatus: formData.paymentStatus,
        orderStatus: formData.orderStatus,
      });
      setToastMessage(`Order "${editingOrder.id}" updated successfully.`);
    } else {
      const orderItems = formData.selectedProductIds.map((pid) => {
        const prod = products.find((p) => p.id === pid);
        return {
          productId: pid,
          name: prod?.name || "Product Item",
          quantity: 1,
          unitPrice: prod?.price || parsedAmount,
        };
      });

      const newOrd = addOrder({
        customerId: selectedCust.id,
        customerName: selectedCust.name,
        customerEmail: selectedCust.email,
        totalAmount: parsedAmount,
        paymentStatus: formData.paymentStatus,
        orderStatus: formData.orderStatus,
        items: orderItems.length > 0 ? orderItems : undefined,
      });

      setToastMessage(`Order "${newOrd.id}" created successfully.`);
    }

    setIsFormOpen(false);
  };

  // Inline Status Change
  const handleQuickStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setToastMessage(`Order ${orderId} status updated to "${newStatus}".`);
  };

  // Delete Order
  const handleConfirmDelete = () => {
    if (!deletingOrder) return;
    deleteOrder(deletingOrder.id);
    setToastMessage(`Order "${deletingOrder.id}" deleted.`);
    setDeletingOrder(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Orders & Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Track purchase orders, fulfillment lifecycle, and payment reconciliation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          + Create Order
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
            placeholder="Search orders by ID, Customer name, email..."
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
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 uppercase font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                      No orders found
                    </p>
                    <p className="text-xs">Try searching with another order ID or resetting status filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const formattedDate = new Date(order.orderDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {order.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-900 dark:text-white">{order.customerName}</p>
                        <p className="text-[11px] text-neutral-400">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : order.paymentStatus === "Refunded"
                              ? "bg-rose-500/15 text-rose-500"
                              : "bg-amber-500/15 text-amber-500"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(order)}
                            title="View Order Details"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(order)}
                            title="Edit Order"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingOrder(order)}
                            title="Delete Order"
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

      {/* CREATE / EDIT ORDER MODAL */}
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
                {editingOrder ? `Edit Order (${editingOrder.id})` : "Create New Order"}
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
                  Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.customerId ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                  }`}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                {formErrors.customerId && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.customerId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Total Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="349.00"
                    value={formData.customAmount}
                    onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.customAmount ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  />
                  {formErrors.customAmount && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.customAmount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={formData.orderStatus}
                  onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
                  {editingOrder ? "Save Changes" : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setViewingOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Order Summary ({viewingOrder.id})
              </h3>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xl flex items-center justify-center">
                🧾
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  ${Number(viewingOrder.totalAmount).toFixed(2)}
                </h4>
                <p className="text-xs text-neutral-400">Customer: {viewingOrder.customerName}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {viewingOrder.paymentStatus}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    {viewingOrder.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3 mb-5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">Customer Email</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">{viewingOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-400">Date</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {new Date(viewingOrder.orderDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                  Line Items ({viewingOrder.items?.length || 1})
                </span>
                <div className="space-y-1.5 divide-y divide-neutral-200/60 dark:divide-neutral-700/60">
                  {(viewingOrder.items || [
                    { name: "Enterprise Solution Package", quantity: 1, unitPrice: viewingOrder.totalAmount },
                  ]).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-1.5">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ${(item.unitPrice * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const ord = viewingOrder;
                  setViewingOrder(null);
                  handleOpenEditModal(ord);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingOrder}
        title="Delete Order?"
        message={`Are you sure you want to permanently delete Order ${deletingOrder?.id} ($${deletingOrder?.totalAmount})?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingOrder(null)}
      />

      {/* TOAST FEEDBACK */}
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage("")} />
    </div>
  );
}
