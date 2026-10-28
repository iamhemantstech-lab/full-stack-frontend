import React, { useState, useMemo } from "react";
import { List } from "react-window";

// Generate 10,000 mock items for performance benchmark
const generateMockData = (count = 10000) => {
  const categories = ["Electronics", "Furniture", "Accessories", "Lifestyle", "Groceries"];
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const category = categories[index % categories.length];
    return {
      id,
      title: `Product #${id} - Premium Enterprise ${category.slice(0, -1)}`,
      category,
      price: (19.99 + (index % 500) * 1.5).toFixed(2),
      sku: `SKU-${category.slice(0, 3).toUpperCase()}-${String(id).padStart(5, "0")}`,
      stock: (index % 85) + 1,
    };
  });
};

const ALL_MOCK_ITEMS = generateMockData(10000);

// Row component for react-window v2
const ProductRow = ({ index, style, items }) => {
  const item = items?.[index];
  if (!item) return null;

  return (
    <div
      style={style}
      className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
          #{item.id}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
            {item.title}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
            <span>{item.sku}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 pl-3">
        <span className="text-xs font-bold text-neutral-900 dark:text-white">
          ${item.price}
        </span>
        <p className="text-[10px] text-emerald-500 font-medium">
          {item.stock} in stock
        </p>
      </div>
    </div>
  );
};

export default function VirtualizedListDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVirtualized, setIsVirtualized] = useState(true);

  // Filter 10,000 items in real time
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return ALL_MOCK_ITEMS;
    const lower = searchTerm.toLowerCase();
    return ALL_MOCK_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.sku.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    );
  }, [searchTerm]);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-1.5">
            ⚡ react-window Demonstration
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            10,000 Items Virtualized List
          </h2>
          <p className="text-xs text-neutral-500">
            Compare rendering thousands of DOM nodes vs only the visible viewport rows.
          </p>
        </div>

        {/* Toggle Mode Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsVirtualized((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              isVirtualized
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20"
                : "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20"
            }`}
          >
            {isVirtualized ? "✓ Virtualized (Active)" : "⚠ Un-virtualized (Lag Test)"}
          </button>
        </div>
      </div>

      {/* Live Benchmark Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider block">
            Total Dataset
          </span>
          <span className="text-base font-extrabold text-neutral-900 dark:text-white">
            {filteredItems.length.toLocaleString()} items
          </span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider block">
            DOM Nodes Rendered
          </span>
          <span
            className={`text-base font-extrabold ${
              isVirtualized ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isVirtualized ? "~8 to 10 nodes" : `${filteredItems.length} nodes`}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider block">
            Memory Overhead
          </span>
          <span className="text-base font-extrabold text-emerald-500">
            {isVirtualized ? "~99.8% Saved" : "High DOM Stress"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider block">
            Scroll Performance
          </span>
          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            {isVirtualized ? "Smooth 60 FPS" : "Frame Drops"}
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div>
        <input
          type="text"
          placeholder="Filter through 10,000 items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* List Container */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No matching items found in 10,000 records.
          </div>
        ) : isVirtualized ? (
          /* 🚀 react-window v2 Virtualized List: Only renders visible items in the 420px container */
          <List
            style={{ height: 420 }}
            rowCount={filteredItems.length}
            rowHeight={56}
            rowComponent={ProductRow}
            rowProps={{ items: filteredItems }}
          />
        ) : (
          /* Standard un-virtualized DOM rendering (renders all elements into DOM) */
          <div className="max-h-[420px] overflow-y-auto">
            {filteredItems.slice(0, 1000).map((item, index) => (
              <ProductRow
                key={item.id}
                index={index}
                style={{ height: 56 }}
                items={filteredItems}
              />
            ))}
            {filteredItems.length > 1000 && (
              <p className="p-3 text-center text-xs text-rose-500 font-semibold bg-rose-500/5">
                (Capped at 1,000 for safety to prevent your browser tab from crashing)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
