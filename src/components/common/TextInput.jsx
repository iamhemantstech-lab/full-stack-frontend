import React, { useState } from "react";

export default function TextInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  autoComplete,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPasswordField = type === "password";

  const computedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name || id}
          type={computedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full py-2 px-3 text-xs rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
            isPasswordField ? "pr-12" : ""
          } ${
            error
              ? "border-rose-500 focus:border-rose-500"
              : "border-neutral-200 dark:border-neutral-700 focus:border-indigo-500"
          }`}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
