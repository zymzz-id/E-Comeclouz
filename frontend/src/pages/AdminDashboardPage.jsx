import { useEffect, useState } from 'react';
import api from '../lib/api';
import ProductForm from '../components/ProductForm';

function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [productsResponse, ordersResponse] = await Promise.all([
      api.get('/products'),
      api.get('/orders'),
    ]);
    setProducts(productsResponse.data);
    setOrders(ordersResponse.data);
  };

  useEffect(() => {
    fetchData().catch(() => setFeedback('Gagal memuat data admin.'));
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        setFeedback('Produk berhasil diperbarui.');
      } else {
        await api.post('/products', payload);
        setFeedback('Produk baru berhasil ditambahkan.');
      }
      setEditingProduct(null);
      await fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Aksi admin gagal diproses.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await api.delete(`/products/${id}`);
      setFeedback('Produk berhasil dihapus.');
      await fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Gagal menghapus produk.');
    }
  };

  return (
    <section className="admin-layout">
      <div>
        <div className="section-heading">
          <div>
            <h1>Panel Admin</h1>
            <p>Kelola katalog produk dan pantau pesanan masuk.</p>
          </div>
        </div>
        {feedback && <p className={feedback.includes('berhasil') ? 'success-text' : 'error-text'}>{feedback}</p>}
        <ProductForm
          initialValue={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setEditingProduct(null)}
          submitting={loading}
        />
      </div>

      <div className="admin-table-wrap">
        <h2>Daftar Produk</h2>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rp{product.price.toLocaleString('id-ID')}</td>
                <td>{product.stock}</td>
                <td className="table-actions">
                  <button type="button" className="ghost-button" onClick={() => setEditingProduct(product)}>
                    Ubah
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(product.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Pesanan Masuk</h2>
        <div className="orders-list">
          {orders.length === 0 && <p>Belum ada pesanan.</p>}
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="summary-line">
                <strong>{order.customerName}</strong>
                <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
              </div>
              <p>{order.email}</p>
              <p>{order.address}</p>
              <p>Metode bayar: {order.paymentMethod}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
              <strong>Total: Rp{order.total.toLocaleString('id-ID')}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
