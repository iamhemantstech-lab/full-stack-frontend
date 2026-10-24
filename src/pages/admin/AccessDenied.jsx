import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../../context/authContext";

export default function AccessDenied() {
  const { currentUser } = useAuthState();
  const { switchRole } = useAuthDispatch();
  const navigate = useNavigate();

  const handlePromoteAndEnter = async () => {
    await switchRole("admin");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mx-auto flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
          403 • Unauthorized
        </span>

        <h1 className="text-2xl font-bold tracking-tight">Access Restricted</h1>

        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          The Admin CRM Portal is reserved for accounts with the <strong>admin</strong> role. Your
          account currently has the{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {currentUser?.role || "user"}
          </span>{" "}
          role.
        </p>

        <div className="pt-4 space-y-2.5">
          <button
            type="button"
            onClick={handlePromoteAndEnter}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            👑 Switch to Admin Role & Access CRM
          </button>
          <Link
            to="/"
            className="block w-full py-2.5 px-4 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            ← Return to Main Application
          </Link>
        </div>
      </div>
    </div>
  );
}
