import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "../context/authContext";

const HomePage = () => {
  const authState = useAuthState?.() || {};
  const currentUser = authState?.currentUser;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-center">
      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Production React Architecture Ready
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Modern React &{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            State Architecture
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          {currentUser?.firstName
            ? `Welcome back, ${currentUser.firstName}! Explore optimized Context performance, protected routing, and live CRM features.`
            : "Explore optimized React patterns with Context splitting, protected route guards, and zero-flicker re-renders."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/demo"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25 transition-all"
          >
            ⚡ Test Re-renders
          </Link>
          <Link
            to="/about"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-all"
          >
            📖 Architecture Guide
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-all"
          >
            💬 Get in Touch
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-2xl">⚡</div>
          <div>
            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              0 ms
            </h4>
            <p className="text-xs text-neutral-500">Wasted Action Re-renders</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-2xl">🔒</div>
          <div>
            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              100%
            </h4>
            <p className="text-xs text-neutral-500">Protected Route Guards</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-2xl">🔄</div>
          <div>
            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              Active
            </h4>
            <p className="text-xs text-neutral-500">Cross-Tab Session Sync</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              useMemo
            </h4>
            <p className="text-xs text-neutral-500">
              Stable Context References
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="space-y-8 text-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Senior Architecture Highlights
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Built with enterprise best practices for scalability and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <span className="text-3xl">🛡️</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Route Guards
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Robust client-side authorization using React Router v7 nested
              layouts and Outlet.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <span className="text-3xl">⚡</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Context Splitting
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Decoupled State and Dispatch contexts to ensure action components
              never re-render.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <span className="text-3xl">💾</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Persistent & Synced
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Local storage persistence backed by instant reactivity and live
              data synchronization.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
