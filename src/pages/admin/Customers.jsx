import React, { useState, useMemo } from "react";
import { useCrm } from "../../context/crmContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Toast from "../../components/common/Toast";

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCrm();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    status: "Active",
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState("");

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm)) ||
        (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || c.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Form Open handlers
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
      status: "Active",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      company: customer.company || "",
      city: customer.city || "",
      status: customer.status || "Active",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
      setToastMessage(`Customer "${formData.name}" updated successfully.`);
    } else {
      const created = addCustomer(formData);
      setToastMessage(`Customer "${created.name}" created successfully.`);
    }

    setIsFormOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingCustomer) return;
    deleteCustomer(deletingCustomer.id);
    setToastMessage(`Customer "${deletingCustomer.name}" was permanently removed.`);
    setDeletingCustomer(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Customers Directory
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your verified clientele, active leads, and accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          + Add Customer
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
            placeholder="Search by name, email, company, phone..."
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

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {["All", "Active", "Lead", "Inactive"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors ${
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

      {/* Customers Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 uppercase font-semibold">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name & Company</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                      No customers found
                    </p>
                    <p className="text-xs">Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {customer.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white">{customer.name}</p>
                          <p className="text-[11px] text-neutral-400">{customer.company || "Independent"} • {customer.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {customer.email}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {customer.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          customer.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : customer.status === "Lead"
                            ? "bg-blue-500/15 text-blue-500"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingCustomer(customer)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(customer)}
                          title="Edit Customer"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCustomer(customer)}
                          title="Delete Customer"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT CUSTOMER MODAL */}
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
                {editingCustomer ? `Edit Customer (${editingCustomer.id})` : "Add New Customer"}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jonathan Edwards"
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.email ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-3456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.phone ? "border-rose-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hill House Design"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boston, MA"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Active">Active</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactive</option>
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
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CUSTOMER DETAILS MODAL */}
      {viewingCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setViewingCustomer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Customer Information</h3>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                {viewingCustomer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{viewingCustomer.name}</h4>
                <p className="text-xs text-neutral-400">{viewingCustomer.company} • {viewingCustomer.city}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {viewingCustomer.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 mb-5 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Customer ID</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{viewingCustomer.id}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Email</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">{viewingCustomer.email}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Phone</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{viewingCustomer.phone}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Lifetime Spend</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${Number(viewingCustomer.totalSpent || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const cust = viewingCustomer;
                  setViewingCustomer(null);
                  handleOpenEditModal(cust);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingCustomer}
        title="Delete Customer?"
        message={`Are you sure you want to remove ${deletingCustomer?.name} (${deletingCustomer?.id})?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCustomer(null)}
      />

      {/* TOAST FEEDBACK */}
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage("")} />
    </div>
  );
}
