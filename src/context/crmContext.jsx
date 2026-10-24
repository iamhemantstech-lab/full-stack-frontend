import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { initialMockCustomers, initialMockProducts, initialMockOrders } from "../data";
import { getStorage, setStorage } from "../utils/storage";

const CRM_CUSTOMERS_KEY = "crm_customers_data";
const CRM_PRODUCTS_KEY = "crm_products_data";
const CRM_ORDERS_KEY = "crm_orders_data";

const CrmContext = createContext(null);

export const CrmProvider = ({ children }) => {
  // 1. Initial State from localStorage or initial mock data
  const [customers, setCustomers] = useState(() => {
    const saved = getStorage(CRM_CUSTOMERS_KEY, null);
    return Array.isArray(saved) && saved.length > 0 ? saved : initialMockCustomers;
  });

  const [products, setProducts] = useState(() => {
    const saved = getStorage(CRM_PRODUCTS_KEY, null);
    return Array.isArray(saved) && saved.length > 0 ? saved : initialMockProducts;
  });

  const [orders, setOrders] = useState(() => {
    const saved = getStorage(CRM_ORDERS_KEY, null);
    return Array.isArray(saved) && saved.length > 0 ? saved : initialMockOrders;
  });

  // 2. Sync to localStorage whenever state changes
  useEffect(() => {
    setStorage(CRM_CUSTOMERS_KEY, customers);
  }, [customers]);

  useEffect(() => {
    setStorage(CRM_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    setStorage(CRM_ORDERS_KEY, orders);
  }, [orders]);

  // ---------------- Customer CRUD ----------------
  const addCustomer = useCallback((customerData) => {
    const newCustomer = {
      id: customerData.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customerData.name.trim(),
      email: customerData.email.trim(),
      phone: customerData.phone?.trim() || "+1 (555) 000-0000",
      company: customerData.company?.trim() || "Independent",
      status: customerData.status || "Active",
      city: customerData.city?.trim() || "New York, NY",
      avatar:
        customerData.avatar ||
        `https://images.unsplash.com/photo-${1534528741775 + (customers.length % 5)}?w=150&auto=format&fit=crop&q=80`,
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
      ...customerData,
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  }, [customers.length]);

  const updateCustomer = useCallback((id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    // Also update customerName across orders if name changed
    if (updatedFields.name || updatedFields.email) {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.customerId === id) {
            return {
              ...ord,
              ...(updatedFields.name ? { customerName: updatedFields.name } : {}),
              ...(updatedFields.email ? { customerEmail: updatedFields.email } : {}),
            };
          }
          return ord;
        })
      );
    }
  }, []);

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ---------------- Product CRUD ----------------
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: productData.id || `PROD-${Math.floor(200 + Math.random() * 800)}`,
      name: productData.name.trim(),
      category: productData.category || "Electronics",
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      status:
        Number(productData.stock) <= 0
          ? "Out of Stock"
          : Number(productData.stock) <= 5
          ? "Low Stock"
          : productData.status || "In Stock",
      sku:
        productData.sku ||
        `SKU-${(productData.category || "GEN").slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      description: productData.description?.trim() || "High performance enterprise hardware.",
      ...productData,
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updatedFields };
          if (typeof updated.stock === "number") {
            if (updated.stock <= 0) updated.status = "Out of Stock";
            else if (updated.stock <= 5) updated.status = "Low Stock";
            else if (updated.status === "Out of Stock" || updated.status === "Low Stock") {
              updated.status = "In Stock";
            }
          }
          return updated;
        }
        return item;
      })
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ---------------- Order CRUD ----------------
  const addOrder = useCallback(
    (orderData) => {
      const newOrder = {
        id: orderData.id || `ORD-${Math.floor(9400 + Math.random() * 600)}`,
        customerId: orderData.customerId || "CUST-1001",
        customerName: orderData.customerName || "Customer",
        customerEmail: orderData.customerEmail || "customer@example.com",
        orderDate: orderData.orderDate || new Date().toISOString(),
        totalAmount: Number(orderData.totalAmount) || 0,
        paymentStatus: orderData.paymentStatus || "Paid",
        orderStatus: orderData.orderStatus || "Processing",
        itemsCount: orderData.items?.length || 1,
        items: orderData.items || [
          {
            productId: "PROD-201",
            name: "Enterprise Software License",
            quantity: 1,
            unitPrice: Number(orderData.totalAmount) || 0,
          },
        ],
        ...orderData,
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Update customer totalSpent and ordersCount
      if (newOrder.customerId) {
        setCustomers((prev) =>
          prev.map((c) => {
            if (c.id === newOrder.customerId) {
              return {
                ...c,
                ordersCount: (c.ordersCount || 0) + 1,
                totalSpent:
                  newOrder.orderStatus !== "Cancelled" && newOrder.paymentStatus !== "Refunded"
                    ? (c.totalSpent || 0) + newOrder.totalAmount
                    : c.totalSpent || 0,
              };
            }
            return c;
          })
        );
      }

      return newOrder;
    },
    []
  );

  const updateOrder = useCallback((id, updatedFields) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  }, []);

  const updateOrderStatus = useCallback((id, newStatus) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, orderStatus: newStatus } : item))
    );
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ---------------- Reset State for Demos ----------------
  const resetToDefaultData = useCallback(() => {
    setCustomers(initialMockCustomers);
    setProducts(initialMockProducts);
    setOrders(initialMockOrders);
    setStorage(CRM_CUSTOMERS_KEY, initialMockCustomers);
    setStorage(CRM_PRODUCTS_KEY, initialMockProducts);
    setStorage(CRM_ORDERS_KEY, initialMockOrders);
  }, []);

  // ---------------- Derived Dashboard Statistics ----------------
  const dashboardStats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;

    // Total Revenue is derived from all active non-cancelled and non-refunded orders
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.orderStatus === "Cancelled" || order.paymentStatus === "Refunded") {
        return sum;
      }
      return sum + (Number(order.totalAmount) || 0);
    }, 0);

    // Recent orders: 5 most recent sorted by date
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);

    // Recent customers: 5 most recent
    const recentCustomers = [...customers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Order status breakdown counts
    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((ord) => {
      if (statusCounts[ord.orderStatus] !== undefined) {
        statusCounts[ord.orderStatus] += 1;
      } else {
        statusCounts.Pending += 1;
      }
    });

    // Monthly revenue trend (e.g. past 6 months)
    const monthlyRevenue = [
      { month: "Jan", revenue: 2450, orders: 4 },
      { month: "Feb", revenue: 3890, orders: 7 },
      { month: "Mar", revenue: 4720, orders: 9 },
      { month: "Apr", revenue: 3200, orders: 6 },
      { month: "May", revenue: Math.round(totalRevenue * 0.45), orders: totalOrders },
      { month: "Jun (Proj)", revenue: Math.round(totalRevenue * 0.52), orders: totalOrders + 3 },
    ];

    return {
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      recentCustomers,
      statusCounts,
      monthlyRevenue,
    };
  }, [customers, products, orders]);

  const value = useMemo(
    () => ({
      customers,
      products,
      orders,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      resetToDefaultData,
      dashboardStats,
    }),
    [
      customers,
      products,
      orders,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      resetToDefaultData,
      dashboardStats,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error("useCrm must be used within a CrmProvider");
  }
  return context;
};
