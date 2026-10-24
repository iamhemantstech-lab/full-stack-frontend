import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../../context/authContext";
import { useAppState, useAppDispatch } from "../../context/dataContext";
import ProfileModal from "../../components/ProfileModal";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { currentUser } = useAuthState();
  const { logout } = useAuthDispatch();
  const { theme } = useAppState();
  const dataDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = `${currentUser?.firstName || "Admin"} ${currentUser?.lastName || "User"}`.trim();
  const initials = (
    (currentUser?.firstName?.[0] || "A") + (currentUser?.lastName?.[0] || "")
  ).toUpperCase();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/customers")) return "Customers Management";
    if (path.includes("/admin/products")) return "Products Inventory";
    if (path.includes("/admin/orders")) return "Orders & Fulfillment";
    return "CRM Analytics Dashboard";
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold border-l-2 border-indigo-600 dark:border-indigo-400"
        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
    }`;

  return (
    <div className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-sans text-left">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ⚡
            </div>
            <div>
              <span className="block text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                Admin CRM
              </span>
              <span className="block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider">
                v2.4 Enterprise
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="lg:hidden p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Main Navigation
          </div>

          <NavLink to="/admin" end className={navLinkClasses} onClick={closeSidebar}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/customers" className={navLinkClasses} onClick={closeSidebar}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Customers</span>
          </NavLink>

          <NavLink to="/admin/products" className={navLinkClasses} onClick={closeSidebar}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={navLinkClasses} onClick={closeSidebar}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Orders</span>
          </NavLink>

          <div className="pt-4 pb-1">
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Exit
            </div>
          </div>

          <NavLink
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700/80 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Back to Main App</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer min-w-0 flex-1"
            title="View Profile Details"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {fullName}
              </p>
              <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                👑 Admin User
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Log out"
            className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle navigation"
              className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Header Search Field */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 text-xs w-48 lg:w-60 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <svg className="w-3.5 h-3.5 text-neutral-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search CRM..."
                aria-label="Global search"
                className="bg-transparent border-none outline-none w-full text-neutral-900 dark:text-white placeholder:text-neutral-400"
              />
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => dataDispatch?.({ type: "TOOGLE_THEME" })}
              className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative" title="3 New Notifications">
              <button
                type="button"
                aria-label="Notifications"
                className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-neutral-900">
                3
              </span>
            </div>

            {/* Profile Pill */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 hover:border-purple-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-neutral-900 dark:text-white">
                {fullName}
              </span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
