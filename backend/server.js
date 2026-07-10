const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-mvp-secret';
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

app.use(cors());
app.use(express.json());

function ensureDataFile(filePath, fallback) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const seedProducts = [
  {
    id: uuidv4(),
    name: 'Sepatu Lari AeroFlex',
    price: 499000,
    category: 'Olahraga',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 12,
    shortDescription: 'Sepatu ringan untuk lari harian dengan bantalan empuk.',
    description: 'AeroFlex dirancang untuk kenyamanan maksimal saat berlari maupun aktivitas kasual. Material mesh membantu sirkulasi udara dan sol responsif menjaga langkah tetap stabil.',
  },
  {
    id: uuidv4(),
    name: 'Headphone NovaSound X2',
    price: 899000,
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stock: 8,
    shortDescription: 'Headphone nirkabel dengan suara jernih dan baterai tahan lama.',
    description: 'NovaSound X2 menghadirkan audio detail, mikrofon bawaan untuk panggilan, dan desain lipat yang praktis untuk mobilitas harian.',
  },
  {
    id: uuidv4(),
    name: 'Tas Kerja UrbanPack',
    price: 349000,
    category: 'Aksesoris',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    stock: 15,
    shortDescription: 'Tas multifungsi dengan kompartemen laptop dan desain minimalis.',
    description: 'UrbanPack cocok untuk pekerja kreatif dan mahasiswa. Memiliki bahan tahan cipratan air serta ruang penyimpanan yang lega.',
  },
  {
    id: uuidv4(),
    name: 'Smartwatch Pulse One',
    price: 1299000,
    category: 'Wearable',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 10,
    shortDescription: 'Jam pintar untuk pemantauan aktivitas dan notifikasi harian.',
    description: 'Pulse One memiliki monitor detak jantung, mode olahraga, notifikasi aplikasi, dan tampilan modern untuk penggunaan sepanjang hari.',
  }
];

ensureDataFile(PRODUCTS_FILE, seedProducts);
ensureDataFile(ORDERS_FILE, []);

const adminUser = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('admin123', 8),
  name: 'Administrator',
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid.' });
    req.user = user;
    next();
  });
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  if (username !== adminUser.username || !bcrypt.compareSync(password, adminUser.passwordHash)) {
    return res.status(401).json({ message: 'Username atau password salah.' });
  }

  const token = jwt.sign(
    { username: adminUser.username, role: 'admin', name: adminUser.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      username: adminUser.username,
      name: adminUser.name,
      role: 'admin',
    },
  });
});

app.get('/api/products', (req, res) => {
  let products = readJson(PRODUCTS_FILE);
  const { search, category } = req.query;

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }

  if (category) {
    products = products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }

  res.json(product);
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { name, price, category, image, stock, shortDescription, description } = req.body;

  if (!name || !price || !category || !image || stock === undefined || !shortDescription || !description) {
    return res.status(400).json({ message: 'Semua field produk wajib diisi.' });
  }

  const products = readJson(PRODUCTS_FILE);
  const newProduct = {
    id: uuidv4(),
    name,
    price: Number(price),
    category,
    image,
    stock: Number(stock),
    shortDescription,
    description,
  };

  products.unshift(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { name, price, category, image, stock, shortDescription, description } = req.body;
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }

  if (!name || !price || !category || !image || stock === undefined || !shortDescription || !description) {
    return res.status(400).json({ message: 'Semua field produk wajib diisi.' });
  }

  const updatedProduct = {
    ...products[index],
    name,
    price: Number(price),
    category,
    image,
    stock: Number(stock),
    shortDescription,
    description,
  };

  products[index] = updatedProduct;
  writeJson(PRODUCTS_FILE, products);
  res.json(updatedProduct);
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }

  const deleted = products.splice(index, 1)[0];
  writeJson(PRODUCTS_FILE, products);
  res.json({ message: 'Produk berhasil dihapus.', deleted });
});

app.post('/api/orders', (req, res) => {
  const { customerName, email, address, items, paymentMethod } = req.body;

  if (!customerName || !email || !address || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Data checkout belum lengkap.' });
  }

  const products = readJson(PRODUCTS_FILE);
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = products.find((productItem) => productItem.id === item.id);

    if (!product) {
      return res.status(400).json({ message: `Produk dengan ID ${item.id} tidak ditemukan.` });
    }

    if (item.quantity > product.stock) {
      return res.status(400).json({ message: `Stok untuk ${product.name} tidak mencukupi.` });
    }

    product.stock -= item.quantity;
    orderItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });
    total += product.price * item.quantity;
  }

  writeJson(PRODUCTS_FILE, products);

  const orders = readJson(ORDERS_FILE);
  const order = {
    id: uuidv4(),
    customerName,
    email,
    address,
    paymentMethod,
    items: orderItems,
    total,
    createdAt: new Date().toISOString(),
    status: 'baru',
  };

  orders.unshift(order);
  writeJson(ORDERS_FILE, orders);
  res.status(201).json({ message: 'Pesanan berhasil dibuat.', order });
});

app.get('/api/orders', authenticateToken, (_req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});
