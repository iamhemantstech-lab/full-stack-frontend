import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCrm } from "../../context/crmContext";
import Toast from "../../components/common/Toast";

export default function Dashboard() {
  const { dashboardStats, resetToDefaultData } = useCrm();
  const [toastMessage, setToastMessage] = useState("");
  const [chartView, setChartView] = useState("revenue"); // "revenue" | "orders"

  const {
    totalCustomers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    recentCustomers,
    statusCounts,
    monthlyRevenue,
  } = dashboardStats;

  const handleResetData = () => {
    resetToDefaultData();
    setToastMessage("Demo datasets successfully reset to default factory state!");
  };

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const maxChartValue = Math.max(
    ...monthlyRevenue.map((d) => (chartView === "revenue" ? d.revenue : d.orders)),
    1
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Executive Overview
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Live analytics derived in real time from synced CRM local data store.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetData}
            title="Reset demo data"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 transition-colors"
          >
            🔄 Reset Demo Data
          </button>
          <Link
            to="/admin/orders"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            + New Order
          </Link>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {totalCustomers}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>↑ +14.2%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {totalProducts}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            <span>● Active SKUs</span>
            <span className="text-neutral-400 font-normal">in inventory</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>↑ +8.5%</span>
            <span className="text-neutral-400 font-normal">active fulfillment</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {formattedRevenue}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>↑ +21.8%</span>
            <span className="text-neutral-400 font-normal">net active sales</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSS-based Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Performance Trends
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Monthly revenue & fulfillment volume
              </p>
            </div>
            <div className="flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60">
              <button
                type="button"
                onClick={() => setChartView("revenue")}
                className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  chartView === "revenue"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Revenue ($)
              </button>
              <button
                type="button"
                onClick={() => setChartView("orders")}
                className={`py-1 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  chartView === "orders"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Orders Count
              </button>
            </div>
          </div>

          <div className="flex items-end justify-around h-48 pt-6 border-b border-neutral-200 dark:border-neutral-800">
            {monthlyRevenue.map((item) => {
              const val = chartView === "revenue" ? item.revenue : item.orders;
              const heightPct = Math.round((val / maxChartValue) * 100);
              return (
                <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                  <div className="relative w-8 sm:w-10 h-36 bg-neutral-100 dark:bg-neutral-800/80 rounded-t-lg flex items-end justify-center">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-400 cursor-pointer"
                      style={{ height: `${Math.max(heightPct, 14)}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                        {chartView === "revenue" ? `$${val.toLocaleString()}` : `${val} orders`}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-neutral-500 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Order Status Summary
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Distribution across all {totalOrders} orders
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { status: "Delivered", bg: "bg-emerald-500", count: statusCounts.Delivered },
              { status: "Shipped", bg: "bg-blue-500", count: statusCounts.Shipped },
              { status: "Processing", bg: "bg-purple-500", count: statusCounts.Processing },
              { status: "Pending", bg: "bg-amber-500", count: statusCounts.Pending },
              { status: "Cancelled", bg: "bg-rose-500", count: statusCounts.Cancelled },
            ].map((item) => {
              const pct = totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                      <span className={`w-2 h-2 rounded-full ${item.bg}`} />
                      {item.status}
                    </span>
                    <span className="text-neutral-500 font-semibold">
                      {item.count} <span className="font-normal opacity-75">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.bg}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Latest fulfillment activities
              </p>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-neutral-400 italic">
                      No recent orders recorded.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ord.id}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-neutral-900 dark:text-white">{ord.customerName}</p>
                        <p className="text-[11px] text-neutral-400">{ord.customerEmail}</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                        ${Number(ord.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.paymentStatus === "Paid"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : ord.paymentStatus === "Refunded"
                              ? "bg-rose-500/15 text-rose-500"
                              : "bg-amber-500/15 text-amber-500"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === "Delivered"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : ord.orderStatus === "Shipped"
                              ? "bg-blue-500/15 text-blue-500"
                              : ord.orderStatus === "Cancelled"
                              ? "bg-rose-500/15 text-rose-500"
                              : "bg-purple-500/15 text-purple-500"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Recent Customers
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Newly registered accounts
              </p>
            </div>
            <Link to="/admin/customers" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentCustomers.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">No customers registered.</p>
            ) : (
              recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">{c.name}</p>
                      <p className="text-[11px] text-neutral-400">{c.company} • {c.city}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : c.status === "Lead"
                        ? "bg-blue-500/15 text-blue-500"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage("")} />
    </div>
  );
}
