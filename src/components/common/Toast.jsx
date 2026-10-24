import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/15 dark:shadow-black/40 animate-in slide-in-from-bottom-5 duration-200 max-w-sm"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          type === "success"
            ? "bg-emerald-500/15 text-emerald-500"
            : type === "error"
            ? "bg-rose-500/15 text-rose-500"
            : "bg-blue-500/15 text-blue-500"
        }`}
      >
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </div>

      <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 flex-1">
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 text-xs transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
