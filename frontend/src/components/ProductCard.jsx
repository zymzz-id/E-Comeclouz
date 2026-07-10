import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-card-body">
        <span className="badge">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="product-meta">
          <strong>Rp{product.price.toLocaleString('id-ID')}</strong>
          <span>Stok {product.stock}</span>
        </div>
        <div className="product-actions">
          <Link to={`/produk/${product.id}`} className="secondary-button">
            Detail
          </Link>
          <button type="button" onClick={() => addToCart(product)}>
            Tambah
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
