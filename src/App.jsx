import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { CrmProvider } from "./context/crmContext";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const BackendFrontendPractice = lazy(
  () => import("./pages/BackendFrontendPractice"),
);
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* User Facing Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route
              path="/backend-frontend-practice"
              element={<BackendFrontendPractice />}
            />
          </Route>
        </Route>

        {/* Admin CRM Portal Protected Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={
              <CrmProvider>
                <AdminLayout />
              </CrmProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        {/* 404 Catch-All Page for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
