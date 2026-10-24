import React, { useEffect } from "react";
import { useAuthState, useAuthDispatch } from "../context/authContext";

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser } = useAuthState();
  const { switchRole } = useAuthDispatch();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const role = currentUser?.role || "user";
  const fullName = `${currentUser?.firstName || "Guest"} ${currentUser?.lastName || "User"}`.trim();
  const email = currentUser?.email || "user@example.com";
  const mobile = currentUser?.mobileNumber || "+1 (555) 234-5678";
  const status = currentUser?.status || "Active";
  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "May 2024";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-left animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 id="profile-modal-title" className="text-lg font-bold text-neutral-900 dark:text-white">
            User Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Hero Banner */}
        <div className="flex items-center gap-4 py-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white truncate">
              {fullName}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-2">
              {email}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  role === "admin"
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                    : "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                }`}
              >
                {role === "admin" ? "👑 Admin" : "👤 Standard User"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 mb-5">
          <div>
            <span className="block text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">
              User ID
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
              {currentUser?.id?.slice(0, 12) || "usr_demo"}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">
              Phone
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {mobile}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">
              Role Access
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
              {role} Privileges
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">
              Member Since
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {joinedDate}
            </span>
          </div>
        </div>

        {/* Role Testing Switcher */}
        <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-dashed border-indigo-500/30 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            <span>🛠️ Role Testing Switcher</span>
            <span className="text-[11px] font-normal text-neutral-500">Live preview</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => switchRole("user")}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                role === "user"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-indigo-400"
              }`}
            >
              👤 Standard User
            </button>
            <button
              type="button"
              onClick={() => switchRole("admin")}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                role === "admin"
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-purple-400"
              }`}
            >
              👑 Admin (CRM)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
