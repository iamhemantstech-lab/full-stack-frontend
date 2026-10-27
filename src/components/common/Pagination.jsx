import React, { useMemo } from "react";

export default React.memo(function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemsCount = true,
  siblingCount = 1,
  className = "",
}) {
  // Generate smart array of page numbers with ellipsis ('...')
  const pages = useMemo(() => {
    if (totalPages <= 1) return [1];

    const totalNumbers = siblingCount * 2 + 3; // current + siblings + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for dots

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages, currentPage, siblingCount]);

  if (totalPages <= 0) return null;

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate items count range
  const startItem =
    totalItems !== undefined && itemsPerPage !== undefined
      ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
      : null;
  const endItem =
    totalItems !== undefined && itemsPerPage !== undefined
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <nav
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 select-none ${className}`.trim()}
      aria-label="Pagination Navigation"
    >
      {/* Items count indicator */}
      {showItemsCount && totalItems !== undefined && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 order-2 sm:order-1">
          Showing{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            {totalItems === 0 ? 0 : startItem}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            {totalItems}
          </span>{" "}
          products
        </div>
      )}

      {/* Navigation Controls: Prev, Page Pills, Next */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-medium">Prev</span>
        </button>

        {/* Numbered Page Buttons & Dots */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400 font-bold"
                >
                  •••
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange && onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={`min-w-8 h-8 px-2.5 text-xs font-semibold rounded-xl transition-all shadow-sm ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-indigo-600/25 ring-2 ring-indigo-600/30"
                    : "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
        >
          <span className="font-medium">Next</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </nav>
  );
});
