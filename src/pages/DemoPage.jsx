import React from "react";
import ReRenderDemoSection from "../components/ReRenderDemoSection";
import VirtualizedListDemo from "../components/VirtualizedListDemo";

export default function DemoPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Performance & Architecture Playground
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto">
          Explore real-world React performance optimizations: Context re-render isolation, and list virtualization with react-window.
        </p>
      </div>

      {/* 1. Context & Re-render Demo */}
      <ReRenderDemoSection />

      {/* 2. react-window 10,000 Items Virtualized Demo */}
      <VirtualizedListDemo />
    </div>
  );
}
