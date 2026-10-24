import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../context/authContext";

export default function ProfileDropdown({ onOpenProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const { currentUser } = useAuthState();
  const navigate = useNavigate();

  const role = currentUser?.role || "user";
  const isAdmin = role === "admin";
  const fullName =
    `${currentUser?.firstName || "Alex"} ${currentUser?.lastName || "User"}`.trim();
  const email = currentUser?.email || "user@example.com";
  const initials = (
    (currentUser?.firstName?.[0] || "U") + (currentUser?.lastName?.[0] || "")
  ).toUpperCase();

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onOpenProfile) onOpenProfile();
  };

  const handleAdminCrmClick = () => {
    setIsOpen(false);
    navigate("/admin");
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Trigger Button with Avatar & Chevron */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User account menu"
        title={`${fullName} (${role})`}
        className={`group inline-flex items-center gap-1.5 p-1 pr-2 rounded-full border transition-all duration-200 outline-none ${
          isOpen
            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20"
            : "border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/60 hover:border-indigo-400/50 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
      >
        <div className="relative w-8 h-8">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold tracking-tight">
              {initials}
            </span>
          </div>
          {/* Live status dot with pulse */}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-900 ${
              isAdmin ? "bg-amber-500" : "bg-emerald-500"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                isAdmin ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
          </span>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-500" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Pure Tailwind Popover Dropdown Card */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute top-[calc(100%+8px)] right-0 w-72 p-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/10 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Info */}
          <div className="p-2 space-y-2.5 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {fullName}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${
                      isAdmin
                        ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {email}
                </p>
              </div>
            </div>

            {/* Quick Testing Role Switcher Pill */}
            <div className="p-1.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/40">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1 px-1">
                <span>Testing Role</span>
                <span className="text-[10px] opacity-75">1-click test</span>
              </div>
              <div
                className="grid grid-cols-2 gap-1"
                role="group"
                aria-label="Demo Role Toggle"
              >
                <button
                  type="button"
                  onClick={() => handleSetRole("user")}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg transition-all ${
                    !isAdmin
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>User</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetRole("admin")}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg transition-all ${
                    isAdmin
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200/80 dark:bg-neutral-800 my-1" />

          {/* Action Items List */}
          <div className="space-y-0.5" role="none">
            {/* Profile Action */}
            <button
              type="button"
              role="menuitem"
              onClick={handleProfileClick}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 flex items-center justify-center shrink-0 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Profile Settings
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  View identity & status
                </p>
              </div>
            </button>

            {/* Admin CRM Action - Shown ONLY for Admin */}
            {isAdmin && (
              <button
                type="button"
                role="menuitem"
                onClick={handleAdminCrmClick}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-neutral-700 dark:text-neutral-200 hover:bg-purple-500/10 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 group-hover:bg-purple-500/25 flex items-center justify-center shrink-0 transition-colors">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Admin CRM Portal
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Fulfillment & analytics
                  </p>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-600 text-white shadow-sm">
                  Portal
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
