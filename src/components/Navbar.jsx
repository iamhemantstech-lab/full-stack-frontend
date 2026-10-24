import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppState } from "../context/dataContext";
import { useAuthDispatch, useAuthState } from "../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import { selectCartTotalCount } from "../store/slices/cartSlice";
import ProfileDropdown from "./ProfileDropdown";
import ProfileModal from "./ProfileModal";
import { logoutUser } from "../store/slices/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme } = useAppState();
  const dispatch = useAppDispatch();
  const dispatchAction = useDispatch();
  const { isAuthenticated } = useAuthState();
  const cartCount = useSelector(selectCartTotalCount);
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleLogout = async () => {
    console.log("aaa");
    closeMenu();
    await dispatchAction(logoutUser());
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors px-2.5 py-1.5 rounded-lg ${
      isActive
        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/60 dark:bg-indigo-950/40"
        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-neutral-950/85 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2.5 no-underline group"
          onClick={closeMenu}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            #
          </div>
          <span className="font-bold text-base text-neutral-900 dark:text-white tracking-tight">
            BrandName
          </span>
        </NavLink>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkStyle}>
            Products
            {cartCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/about" className={navLinkStyle}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkStyle}>
            Contact
          </NavLink>
          <NavLink to="/demo" className={navLinkStyle}>
            Performance
          </NavLink>
          <NavLink to="/backend-frontend-practice" className={navLinkStyle}>
            MERN
          </NavLink>
        </div>

        {/* Actions (Theme toggle + Profile + Auth) */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => dispatch({ type: "TOOGLE_THEME" })}
            className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <ProfileDropdown onOpenProfile={() => setIsProfileOpen(true)} />
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigate("/login");
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            <NavLink to="/" onClick={closeMenu} className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={closeMenu}
              className={navLinkStyle}
            >
              Products {cartCount > 0 && `(${cartCount})`}
            </NavLink>
            <NavLink to="/about" onClick={closeMenu} className={navLinkStyle}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu} className={navLinkStyle}>
              Contact
            </NavLink>
            <NavLink to="/demo" onClick={closeMenu} className={navLinkStyle}>
              Performance
            </NavLink>
            <NavLink
              to="/backend-frontend-practice"
              onClick={closeMenu}
              className={navLinkStyle}
            >
              MERN
            </NavLink>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOOGLE_THEME" })}
              className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5"
            >
              Mode: {theme === "light" ? "Light ☀️" : "Dark 🌙"}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <ProfileDropdown onOpenProfile={() => setIsProfileOpen(true)} />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </header>
  );
}
