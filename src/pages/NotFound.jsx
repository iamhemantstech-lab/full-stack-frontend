import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Decorative Background Glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" 
      />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 py-10 px-6 sm:px-10 rounded-3xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-xl shadow-2xl shadow-neutral-950/5">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Error 404
        </div>

        {/* 404 Headline with Gradient Text */}
        <div className="space-y-3">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tight leading-none bg-gradient-to-br from-neutral-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent select-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Lost in Space? Page Not Found
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-98 transition-all"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Quick Discovery Links */}
        <div className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500 dark:text-neutral-400">
          <p className="mb-3 font-medium">Looking for one of these?</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link 
              to="/products" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Explore Products
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <Link 
              to="/contact" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Contact Support
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <Link 
              to="/login" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
