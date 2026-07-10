import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, totals, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="empty-state">
        <h1>Keranjang masih kosong</h1>
        <p>Tambahkan produk terlebih dahulu sebelum checkout.</p>
        <Link to="/produk">Belanja sekarang</Link>
      </section>
    );
  }

  return (
    <section className="cart-layout">
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>Rp{item.price.toLocaleString('id-ID')}</p>
              <div className="qty-row">
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                />
                <button type="button" className="ghost-button" onClick={() => removeFromCart(item.id)}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="summary-card">
        <h2>Ringkasan Belanja</h2>
        <p>Total item: {totals.count}</p>
        <p>Total bayar</p>
        <strong>Rp{totals.amount.toLocaleString('id-ID')}</strong>
        <Link to="/checkout">Lanjut Checkout</Link>
      </aside>
    </section>
  );
}

export default CartPage;
