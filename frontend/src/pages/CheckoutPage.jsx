import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

const initialForm = {
  customerName: '',
  email: '',
  address: '',
  paymentMethod: 'transfer bank',
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totals, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setMessage('Keranjang kosong, silakan pilih produk terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
      };
      const response = await api.post('/orders', payload);
      setMessage(`Checkout berhasil. ID pesanan: ${response.data.order.id}`);
      clearCart();
      setTimeout(() => navigate('/produk'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Checkout gagal.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h1>Checkout Sederhana</h1>
        <label>
          Nama lengkap
          <input name="customerName" value={form.customerName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Alamat pengiriman
          <textarea name="address" rows="4" value={form.address} onChange={handleChange} required />
        </label>
        <label>
          Metode pembayaran
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="transfer bank">Transfer Bank</option>
            <option value="e-wallet">E-Wallet</option>
            <option value="cod">COD</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Buat Pesanan'}</button>
        {message && <p className={message.includes('berhasil') ? 'success-text' : 'error-text'}>{message}</p>}
      </form>
      <aside className="summary-card">
        <h2>Ringkasan Checkout</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="summary-line">
            <span>{item.name} x {item.quantity}</span>
            <strong>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</strong>
          </div>
        ))}
        <hr />
        <div className="summary-line">
          <span>Total</span>
          <strong>Rp{totals.amount.toLocaleString('id-ID')}</strong>
        </div>
      </aside>
    </section>
  );
}

export default CheckoutPage;
