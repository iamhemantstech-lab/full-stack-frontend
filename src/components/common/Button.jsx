import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold text-xs py-2 px-4 rounded-xl transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20",
    secondary: "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20",
    outline: "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  }[variant] || "bg-indigo-600 text-white";

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
