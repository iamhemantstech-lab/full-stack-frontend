import React, { useEffect } from "react";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center animate-in zoom-in-95 duration-150"
      >
        <div
          className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
            type === "danger"
              ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
              : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 id="confirm-dialog-title" className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`flex-1 py-2 px-4 text-xs font-semibold rounded-xl text-white shadow-sm transition-colors ${
              type === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
