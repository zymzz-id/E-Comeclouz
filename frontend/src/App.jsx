import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="produk" element={<ProductsPage />} />
        <Route path="produk/:id" element={<ProductDetailPage />} />
        <Route path="keranjang" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="admin"
          element={(
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          )}
        />
      </Route>
    </Routes>
  );
}

export default App;
