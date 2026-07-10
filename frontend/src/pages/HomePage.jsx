import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">Starter project e-commerce MVP</span>
        <h1>Bangun toko online sederhana yang siap dikembangkan.</h1>
        <p>
          TokoKilat adalah template e-commerce berbahasa Indonesia dengan katalog produk,
          keranjang, checkout, serta panel admin minimal untuk mengelola produk.
        </p>
        <div className="hero-actions">
          <Link to="/produk">
            Lihat Produk
          </Link>
          <Link to="/admin/login" className="secondary-button">
            Login Admin
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <h2>Fitur utama</h2>
        <ul>
          <li>Beranda modern dan responsif</li>
          <li>Daftar produk dan detail produk</li>
          <li>Keranjang belanja berbasis localStorage</li>
          <li>Checkout sederhana ke backend</li>
          <li>Panel admin CRUD produk + daftar pesanan</li>
        </ul>
      </div>
    </section>
  );
}

export default HomePage;
