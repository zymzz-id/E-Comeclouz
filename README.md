# TokoKilat - Starter Project E-Commerce MVP

TokoKilat adalah starter project e-commerce dasar berbahasa Indonesia yang siap dijalankan secara lokal. Proyek ini cocok untuk prototipe cepat, demo internal, atau fondasi pengembangan toko online yang lebih lengkap.

## Fitur

- Halaman beranda modern
- Daftar produk dengan pencarian sederhana
- Detail produk
- Keranjang belanja dengan penyimpanan `localStorage`
- Checkout sederhana ke backend
- Panel admin minimal untuk CRUD produk
- Login admin berbasis JWT
- Data contoh produk dan pencatatan pesanan ke file JSON lokal

## Stack

### Frontend
- React + Vite
- React Router
- Axios
- CSS sederhana tanpa framework agar mudah dipelajari

### Backend
- Node.js + Express
- JWT untuk autentikasi admin
- Penyimpanan sederhana berbasis file JSON

## Struktur proyek

```bash
frontend/   # aplikasi React
backend/    # API Express + data JSON lokal
README.md
```

## Menjalankan proyek

### 1. Jalankan backend

```bash
cd backend
npm install
npm start
```

Backend akan aktif di `http://localhost:4000`.

### 2. Jalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan aktif di `http://localhost:5173`.

## Login admin demo

- Username: `admin`
- Password: `admin123`

## Endpoint utama

- `GET /api/products` - daftar produk
- `GET /api/products/:id` - detail produk
- `POST /api/auth/login` - login admin
- `POST /api/products` - tambah produk
- `PUT /api/products/:id` - ubah produk
- `DELETE /api/products/:id` - hapus produk
- `POST /api/orders` - checkout / buat pesanan
- `GET /api/orders` - daftar pesanan untuk admin

## Catatan MVP

- Penyimpanan data masih menggunakan file JSON lokal agar mudah dipahami.
- Belum ada upload gambar; gunakan URL gambar.
- Belum ada pembayaran nyata, ongkir, atau manajemen user pelanggan.
- Cocok sebagai starter project yang bisa diperluas ke database SQL/NoSQL dan autentikasi penuh.

## Ide pengembangan lanjutan

- Tambahkan kategori dan filter lanjutan
- Integrasi database PostgreSQL atau MongoDB
- Upload gambar produk
- Status pesanan multi-tahap
- Autentikasi pelanggan dan riwayat pesanan
- Integrasi payment gateway
