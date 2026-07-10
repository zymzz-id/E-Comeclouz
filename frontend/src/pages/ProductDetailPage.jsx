import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Produk tidak ditemukan atau backend belum aktif.');
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!product) return <p>Memuat detail produk...</p>;

  return (
    <section className="detail-layout">
      <img src={product.image} alt={product.name} className="detail-image" />
      <div>
        <span className="badge">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="price-large">Rp{product.price.toLocaleString('id-ID')}</p>
        <p>{product.description}</p>
        <p className="stock-text">Stok tersedia: {product.stock}</p>
        <button type="button" onClick={() => addToCart(product)}>
          Tambah ke Keranjang
        </button>
      </div>
    </section>
  );
}

export default ProductDetailPage;
