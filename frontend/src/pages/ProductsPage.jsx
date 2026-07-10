import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Gagal memuat produk. Pastikan backend berjalan.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <section>
      <div className="section-heading">
        <div>
          <h1>Semua Produk</h1>
          <p>Pilih produk terbaik untuk demo toko online Anda.</p>
        </div>
        <input
          className="search-input"
          placeholder="Cari produk..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Memuat produk...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsPage;
