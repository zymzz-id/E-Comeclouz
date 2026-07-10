import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  price: '',
  category: '',
  image: '',
  stock: '',
  shortDescription: '',
  description: '',
};

function ProductForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(initialValue || emptyForm);
  }, [initialValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Nama produk
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Kategori
          <input name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Harga
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Stok
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
        </label>
      </div>
      <label>
        URL gambar
        <input name="image" value={form.image} onChange={handleChange} required />
      </label>
      <label>
        Ringkasan singkat
        <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
      </label>
      <label>
        Deskripsi lengkap
        <textarea name="description" rows="5" value={form.description} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan produk'}</button>
        {onCancel && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
