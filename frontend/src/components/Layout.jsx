import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingCart, Store, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { totals } = useCart();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav-bar">
          <NavLink to="/" className="brand">
            <Store size={22} />
            <span>TokoKilat</span>
          </NavLink>
          <nav className="main-nav">
            <NavLink to="/">Beranda</NavLink>
            <NavLink to="/produk">Produk</NavLink>
            <NavLink to="/keranjang" className="cart-link">
              <ShoppingCart size={18} />
              <span>Keranjang ({totals.count})</span>
            </NavLink>
            <NavLink to={isAuthenticated ? '/admin' : '/admin/login'}>
              <ShieldCheck size={18} />
              <span>Admin</span>
            </NavLink>
            {isAuthenticated && (
              <button type="button" className="ghost-button" onClick={logout}>
                Keluar
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
