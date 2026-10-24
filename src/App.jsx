import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DemoPage from "./pages/DemoPage";
import ProductsPage from "./pages/ProductsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { CrmProvider } from "./context/crmContext";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import ProductDetails from "./pages/ProductDetails";
import BackendFrontendPractice from "./pages/BackendFrontendPractice";

function App() {
  return (
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
    </Routes>
  );
}

export default App;
