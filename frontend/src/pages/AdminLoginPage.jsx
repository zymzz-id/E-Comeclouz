import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-card">
      <h1>Login Admin</h1>
      <p>Gunakan akun demo untuk masuk ke panel admin.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
        {error && <p className="error-text">{error}</p>}
      </form>
      <div className="demo-box">
        <strong>Akun demo</strong>
        <span>Username: admin</span>
        <span>Password: admin123</span>
      </div>
    </section>
  );
}

export default AdminLoginPage;
